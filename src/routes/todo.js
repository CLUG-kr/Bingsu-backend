const Router = require('koa-router'),
      bodyParser = require('koa-bodyparser'),
      {Todo, Teammate} = require('../../database/models'),
      router = new Router();

router.get('/', async (ctx, next) => {
    ctx.result = ctx.request.query.teamId ? await Todo.findAll({
        where: {
            stdno: ctx.user.stdno,
            teamId: ctx.request.query.teamId
        }
    }) : await Todo.findAll({
        where: {
            stdno: ctx.user.stdno
        }
    });
    await next();
});
router.get('/toggle/:id', async (ctx, next) => {
    let todo = await Todo.findByPk(ctx.params.id);
    if (await Teammate.findOne({where:{stdno: ctx.user.stdno, teamId: todo.teamId}}) === null)
        throw new APIError("권한이 없습니다.");
    todo.checked = !todo.checked;
    await todo.save();

    ctx.result = todo.checked;
    await next();
});
router.post('/create', bodyParser({enableTypes: ['json']}), async (ctx, next) => {
    let {name, teamId} = ctx.request.body;
    let todo = await Todo.create({
        teamId,
        name,
        stdno: ctx.user.stdno
    });
    ctx.result = todo.id;
    await next();
});

module.exports = router;