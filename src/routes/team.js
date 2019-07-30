const Router = require('koa-router'),
      {Team, Invitation, Teammate} = require('../../database/models'),
      bodyParser = require('koa-bodyparser'),
      teamDetailRouter = require('./teamDetail'),
      router = new Router();

router.get('/', async (ctx, next) => {
    ctx.result = await ctx.user.getTeams();
    await next();
});
router.post('/', bodyParser({enableTypes: ['json']}), async (ctx, next) => {
    let {name, deadline} = ctx.request.body;
    let team = await Team.create({
        name,
        deadline: new Date(deadline),
        leader: ctx.user.stdno
    });
    await Teammate.create({
        teamId: team.id,
        stdno: ctx.user.stdno,
        name: ctx.user.name
    });
    ctx.result = team.id;
    await next();
});
router.use('/:team', async (ctx, next) => {
    let team = await Team.findOne({id: ctx.params.team});
    if (team) {
        let teammates = await Teammate.findAll({where: {teamId: team.id}}),
            leader = team.leader;
        if (ctx.user.isInTeam(team.teamId)) {
            ctx.team = {
                id: team.id,
                name: team.name,
                teammates,
                deadline: team.deadline,
                leader: team.leader
            };
            ctx.user.isLeader = leader == ctx.user.stdno;
            await next();
        } else {
            throw new APIError("당신이 들어간 팀이 아닙니다.");
        }
    } else {
        throw new APIError("팀을 찾을 수 없습니다.");
    }
});
router.use('/:team', teamDetailRouter.routes());
router.use('/:team', teamDetailRouter.allowedMethods());

module.exports = router;