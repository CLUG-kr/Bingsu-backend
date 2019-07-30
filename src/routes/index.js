const Router = require('koa-router'),
      Authenticator = require('../auth'),
      authRouter = require('./auth'),
      teamRouter = require('./team'),
      authenticator = new Authenticator(),
      router = new Router();

global.APIError = class extends Error {};

router.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.type = 'application/json';
        if (err.constructor.name == 'APIError') {
            ctx.status = err.status || 500;
            ctx.body = JSON.stringify({success: false, error: {message: err.message || ''}});
        } else {
            ctx.status = 500;
            ctx.body = JSON.stringify({success: false, error: {message: 'Unknown error occured'}});
            console.error(err);
        }
    }
})
router.use(authenticator.authenticate);
router.use('/auth', authRouter.routes(), authRouter.allowedMethods());
router.use('/team', authenticator.authorize, teamRouter.routes(), teamRouter.allowedMethods());
router.use(async (ctx, next) => {
    if (ctx.result) {
        ctx.status = 200;
        ctx.body = JSON.stringify({success: true, result: ctx.result});
        await next();
    }
})

module.exports = router;