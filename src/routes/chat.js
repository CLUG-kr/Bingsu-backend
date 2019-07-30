const Router = require('koa-router'),
      bodyParser = require('koa-bodyparser'),
      {Op} = require('sequelize'),
      {Message, MessageRead, Teammate} = require('../../database/models'),
      router = new Router();

router.get('/:id/mark_as_read', async (ctx, next) => {
    if (!ctx.user.isInTeam(ctx.params.id))
        throw new APIError('당신의 팀이 아닙니다.');
    let messageRead = await MessageRead.findOne({where:{stdno: ctx.user.stdno,teamId: ctx.params.id}});
    if (messageRead) {
        messageRead.readUntil = new Date();
        await messageRead.save();
    } else {
        await MessageRead.create({
            stdno: ctx.user.stdno,
            teamId: ctx.params.id,
            readUntil: new Date()
        });
    }

    ctx.result = true;
    await next();
});
router.get('/:id/get', async (ctx, next) => {
    if (!ctx.user.isInTeam(ctx.params.id))
        throw new APIError('당신의 팀이 아닙니다.');
    let from = null, until = null, limit = 30;
    if (ctx.request.query.from)
        from = new Date(ctx.request.query.from);
    if (ctx.request.query.until)
        until = new Date(ctx.request.query.until);
    if (ctx.request.query.limit)
        limit = Number(ctx.request.query.limit);
    
    let filter = {
        where: {
            teamId: ctx.params.id
        },
        limit
    };
    if (from || until) filter.where.timestamp = {};
    if (from) filter.where.timestamp[Op.gte] = from.getTime();
    if (until) filter.where.timestamp[Op.lte] = until.getTime();

    let messages = await Message.findAll(filter);
    ctx.result = [];
    for(let i of messages) {
        let unreads = (await Teammate.findAll({where: {teamId: ctx.params.id}})).map(i => i.stdno), reads = [];
        for(let i of unreads) {
            let readMarker = await MessageRead.findOne({stdno: i, teamId: ctx.params.id});
            if (readMarker !== null && readMarker.readUntil >= messages[messages.length - 1].timestamp) {
                unreads.splice(unreads.indexOf(i), 1);
                reads.push(i);
            }
        }
        ctx.result.push({
            message: i.message,
            stdno: i.stdno,
            unreads,
            reads
        });
    }
    await next();
});
router.post('/:id/send', bodyParser({enableTypes: ['json']}), async (ctx, next) => {
    if (!ctx.user.isInTeam(ctx.params.id))
        throw new APIError('당신의 팀이 아닙니다.');
    await Message.create({
        stdno: ctx.user.stdno,
        teamId: ctx.params.id,
        message: ctx.request.body.message,
        timestamp: new Date()
    });

    ctx.result = true;
    await next();
});

module.exports = router;