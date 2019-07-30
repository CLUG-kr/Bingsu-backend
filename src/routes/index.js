const Router = require('koa-router'),
      Authenticator = require('../auth'),
      teamMiddleware = require('../middleware/team'),
      authRouter = require('./auth'),
      teamRouter = require('./team'),
      todoRouter = require('./todo'),
      chatRouter = require('./chat'),
      invitationsRouter = require('./invitations.js')
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
router.use('/team', authenticator.authorize, teamMiddleware, teamRouter.routes(), teamRouter.allowedMethods());
router.use('/todo', authenticator.authorize, teamMiddleware, todoRouter.routes(), todoRouter.allowedMethods());
router.use('/chat', authenticator.authorize, teamMiddleware, chatRouter.routes(), chatRouter.allowedMethods());
router.use('/invitations', authenticator.authorize, teamMiddleware, invitationsRouter.routes(), invitationsRouter.allowedMethods());
router.use(async (ctx, next) => {
    if (ctx.result) {
        ctx.status = 200;
        ctx.body = JSON.stringify({success: true, result: ctx.result});
        await next();
    }
})

module.exports = router;