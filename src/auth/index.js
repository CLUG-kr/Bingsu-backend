const jwt = require('jsonwebtoken');

module.exports = function () {
    let _jwtSecret = config.jwtSecret;

    /**
     * Create token with user uid
     * @param {string} cau authenticated cau object
     */
    this.createToken = async (cau) => {
        let {stdno, kornm} = await cau.getInfo();
        let {curyear, curshtm} = (await cau.getInfo()).loginInfo;
        return jwt.sign({
            "exp": Math.floor(Date.now() / 1000) + 60 * 60 * 3, // 3hr
            "aud": stdno,
            "name@bingsu": kornm,
            "year@bingsu": curyear,
            "shtm@bingsu": curshtm
        }, _jwtSecret);

    }

    // middleware
    this.authenticate = async (ctx, next) => {
        let tokenString = null;
        if (ctx.request.headers["authorization"] && ctx.request.headers["authorization"].startsWith('Bearer'))
            tokenString = ctx.request.headers["authorization"].substring(7);
        else if(ctx.cookies.get('token'))
            tokenString = ctx.cookies.get('token');
        if (tokenString) {
            let token = jwt.verify(tokenString, _jwtSecret);
            ctx.user = {
                stdno: token.aud,
                name: token["name@bingsu"]
            };
            ctx.year = token["year@bingsu"];
            ctx.shtm = token["shtm@bingsu"];
            if (config.pinShtm)
                ctx.shtm = config.pinShtm;
        }
        await next();
    }

    this.authorize = async (ctx, next) => {
        if (ctx.user)
            await next();
        else {
            throw new APIError("인증되지 않았습니다. 로그인해주세요.");
        }
    }
}