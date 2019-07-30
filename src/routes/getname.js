const {Teammate} = require('../../database/models');

module.exports = (ctx, next) => {
    let teams = ctx.user.getTeams(),
        query = ctx.params.stdno;
    for(let team of teams) {
        let teammates = await Teammate.findAll({where:{teamId: team}});
        if (teammates.map(i => i.stdno).some(i == query)) {
            ctx.result = (await User.findOne({stdno: query})).name;
            return await next();
        }
    }
    ctx.result = null;
    await next();
}