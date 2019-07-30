const Router = require('koa-router'),
      Timeblocks = require('../timeBlocks'),
      bodyParser = require('koa-bodyparser'),
      {Meeting, Freetime, Invitation} = require('../../database/models'),
      router = new Router();

router.get('/available_times', async (ctx, next) => {
    let timeblocks = new Timeblocks();
    for(let i of ctx.team.teammates) {
        let unavailables = await Freetime.findAll({
            where: {
                year: ctx.year,
                shtm: ctx.shtm,
                stdno: ctx.user.stdno
            }
        });
        for(let j of unavailables)
            timeblocks.addClass(j.day, j.from, j.until);
    }
    ctx.result = timeblocks.getSpareBlocks();
    await next();
});
router.get('/meetings', async (ctx, next) => {
    ctx.result = await Meeting.findAll({
        where:{
            teamId: ctx.team.id
        }
    });
    await next();
});
router.get('/invite/:stdno', async (ctx, next) => {
    if (!ctx.user.isTeamLeader)
        throw new APIError('팀 리더만 초대할 수 있습니다.');
    await Invitation.create({
        teamId: ctx.team.id,
        stdno: ctx.params.stdno
    });
    ctx.result = true;
    await next();
});
router.post('/meetings/create', bodyParser({enableTypes: ['json']}), async (ctx, next) => {
    let {from, until, name, place} = ctx.request.body;
    await Meeting.create({
        from,
        until,
        name,
        place,
        teamId: ctx.team.id
    });
});

module.exports = router;