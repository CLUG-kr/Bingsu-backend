const Router = require('koa-router'),
      {Freetime, User} = require('../../database/models'),
      bodyParser = require('koa-bodyparser'),
      Authenticator = require('../auth'),
      Cau = require('../cau'),
      authenticator = new Authenticator(),
      router = new Router();

router.post('/login', bodyParser({enableTypes: ['json']}), async (ctx, next) => {
    // validate body
    if (typeof ctx.request.body.id !== 'string')
        throw new APIError('포탈 ID를 입력해주세요.');
    else if (typeof ctx.request.body.password !== 'string')
        throw new APIError('포탈 비밀번호를 입력해주세요.');
    else if(ctx.user)
        throw new APIError('이미 로그인했습니다.');

    // login portal
    const {id, password} = ctx.request.body;
    let cau = new Cau();
    await cau.login(id, password);

    // save name
    let {stdno, kornm} = (await cau.getInfo()).loginInfo;
    if(await User.findOne({stdno: stdno}) == null)
        await User.create({stdno: stdno, name: kornm})

    // create token
    let jwt = await authenticator.createToken(cau);
    ctx.result = {token: jwt};

    // set cookie if needed
    if (ctx.request.body.setCookies === true)
        ctx.cookies.set('token', jwt);

    // get timetable
    let {curyear, curshtm} = (await cau.getInfo()).loginInfo;
    if (config.pinShtm)
        curshtm = config.pinShtm;
    if(await Freetime.findOne({where:{stdno, year: curyear, shtm: curshtm}}) ==  null) {
        let timetable = config.pinShtm ? await cau.getTimetable({curshtm : config.pinShtm}) : await cau.getTimetable();
        let allFree = true;
        for(let i of timetable) {
            // from, until, days
            let {from, until} = i;
            for(let j = 0; j < 6; j++)
                if (i.days[j]) {
                    await Freetime.create({
                        from,
                        until,
                        day: j,
                        year: curyear,
                        shtm: curshtm,
                        stdno
                    });
                    allFree = false;
                }
        }
        if (allFree)
            await Freetime.create({
                from: null,
                until: null,
                day: -1,
                year: curyear,
                shtm: curshtm,
                stdno
            });
    }

    // logout portal
    await cau.logout();

    await next();
});

module.exports = router;