let {Team, Teammate} = require('../../database/models');

module.exports = async function (ctx, next) {
    ctx.user.getTeams = async function () {
        let teamIds = (await Teammate.findAll({where: {stdno: ctx.user.stdno}})).map(i => i.teamId);
        let result = [];
        for(let i of teamIds)
            if (!teamIds.map(j => j.id).includes(i))
                result.push(await Team.findByPk(i));
        result = result.map(i => {return {id:i.id, name:i.name, deadline: i.deadline}})
        return result;
    };
    ctx.user.isInTeam = async function (id) {
        let teams = await ctx.user.getTeams();
        return teams.includes(id);
    };
    await next();
}