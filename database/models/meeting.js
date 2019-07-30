'use strict';
module.exports = (sequelize, DataTypes) => {
  const Meeting = sequelize.define('Meeting', {
    from: DataTypes.DATE,
    until: DataTypes.DATE,
    teamId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  Meeting.associate = function(models) {
    // associations can be defined here
  };
  return Meeting;
};