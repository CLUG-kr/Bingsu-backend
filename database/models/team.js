'use strict';
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: DataTypes.STRING,
    leader: DataTypes.INTEGER
  }, {});
  Team.associate = function(models) {
    // associations can be defined here
  };
  return Team;
};