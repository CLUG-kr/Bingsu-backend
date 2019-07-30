const Router = require('koa-router'),
      {Timetable} = require('../../database/models'),
      bodyParser = require('koa-bodyparser'),
      router = new Router();

router.post('/', bodyParser({enableTypes: ['json']}), async (ctx, next) => {
    if (typeof ctx.request.body.id !== 'string')
        throw new APIError('Id not present');
    else if (typeof ctx.request.body.password !== 'string')
        throw new APIError('Password not present');
    else if(ctx.user)
        throw new APIError('Already authenticated');
    const {id, password} = ctx.request.body;
    let jwt = await authenticator.createToken(id, password);
    ctx.result = {token: jwt};
    await next();
});

module.exports = router;