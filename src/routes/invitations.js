const Router = require('koa-router'),
      {Invitation, Teammate} = require('../../database/models'),
      router = new Router();

router.get('/', async (ctx, next) => {
    ctx.result = await Invitation.findAll({
        where: {
            stdno: ctx.user.stdno
        }
    });
    await next();
});
router.get('/accept/:id', async (ctx, next) => {
    let invitation = await Invitation.findByPk(ctx.params.id);
    if (invitation.stdno !== ctx.user.stdno)
        throw new APIError('당신의 초대장이 아닙니다.');
    else {
        if (ctx.user.isInTeam(invitation.teamId)) {
            await invitation.destroy();
            ctx.result = false;
            await next();
        } else {
            await Teammate.create({
                teamId: invitation.teamId,
                stdno: Text.user.stdno,
                name: ctx.user.name
            });
            ctx.result = true;
            await next();
        }
    }
});
router.get('/deny/:id', async (ctx, next) => {
    let invitation = await Invitation.findByPk(ctx.params.id);
    if (invitation.stdno !== ctx.user.stdno)
        throw new APIError('당신의 초대장이 아닙니다.');
    else {
        await invitation.destroy();
        ctx.result = true;
        await next();
    }

});
module.exports = router;