const Router = require('koa-router'),
      {Team, Meeting, Teammate} = require('../../database/models'),
      bodyParser = require('koa-bodyparser'),
      router = new Router();

router.get('/', async (ctx, next) => {
    ctx.result = await Team.findAll({where:{
        leader: ctx.user.stdno
    }});
    await next();
});
router.post('/create', bodyParser({enableTypes: ['json']}), async (ctx, next) => {
    let {name, deadline} = ctx.request.body
    await BodyType.create({
        name,
        deadline: Date.parse(deadline),
        leader: ctx.user.stdno
    });
    ctx.result = true;
    await next();
});
router.post('/invites', bodyParser({enableTypes: ['json']}), async (ctx, next) => {
    let {name, deadline} = ctx.request.body
    await BodyType.create({
        name,
        deadline: Date.parse(deadline),
        leader: ctx.user.stdno
    });
    ctx.result = true;
    await next();
});
router.get('/:team', async (ctx, next) => {

});

module.exports = router;