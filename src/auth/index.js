const jwt = require('jsonwebtoken');

module.exports = function () {
    let _jwtSecret = config.jwtSecret;

    /**
     * Create token with user uid
     * @param {string} cau authenticated cau object
     */
    this.createToken = async (cau) => {
        let {stdno, userNm} = await cau.getInfo();
        return jwt.sign({
            "exp": Math.floor(Date.now() / 1000) + 60 * 60 * 3, // 3hr
            "aud": stdno,
            "name@bingsu": userNm
        }, _jwtSecret);

    }

    // middleware
    this.authenticate = async (ctx, next) => {
        if (ctx.request.headers["Authorization"] && ctx.request.headers["Authorization"].startsWith('Bearer')) {
            let tokenString = ctx.request.headers["Authorization"].substring(7);
            let token = jwt.verify(tokenString, _jwtSecret);
            ctx.user = {
                stdno: token.aud,
                name: token["name@bingsu"]
            }
        }
        await next();
    }

    this.authorize = async (ctx, next) => {
        if (ctx.user)
            await next();
        else {
            throw new APIError("Unauthorized");
        }
    }
}