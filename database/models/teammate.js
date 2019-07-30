'use strict';
module.exports = (sequelize, DataTypes) => {
  const teammate = sequelize.define('teammate', {
    teamId: DataTypes.INTEGER,
    stdno: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  teammate.associate = function(models) {
    // associations can be defined here
  };
  return teammate;
};