const Router = require('koa-router'),
      {Freetime} = require('../../database/models'),
      bodyParser = require('koa-bodyparser'),
      Authenticator = require('../auth'),
      Cau = require('../cau'),
      authenticator = new Authenticator(),
      router = new Router();

router.post('/login', bodyParser({enableTypes: ['json']}), async (ctx, next) => {
    // validate body
    if (typeof ctx.request.body.id !== 'string')
        throw new APIError('Id not present');
    else if (typeof ctx.request.body.password !== 'string')
        throw new APIError('Password not present');
    else if(ctx.user)
        throw new APIError('Already authenticated');

    // login portal
    const {id, password} = ctx.request.body;
    let cau = new Cau();
    await cau.login(id, password);

    // create token
    let jwt = await authenticator.createToken(cau);
    ctx.result = {token: jwt};

    // get timetable
    let {stdno, curyear, curshtm} = (await cau.getInfo()).loginInfo;
    if(await Freetime.findOne({where:{stdno, year: curyear, shtm: curshtm}}) ==  null) {
        let timetable = await cau.getTimetable();
        let allFree = true;
        for(let i of timetable) {
            console.log(i)
            // from, until, days
            let {from, until} = i;
            for(let i = 0; i < 6; i++)
                if (i.days[i]) {
                    await Freetime.create({
                        from,
                        until,
                        day: i,
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