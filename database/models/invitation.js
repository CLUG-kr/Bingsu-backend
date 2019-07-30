'use strict';
module.exports = (sequelize, DataTypes) => {
  const Invitation = sequelize.define('Invitation', {
    teamId: DataTypes.INTEGER,
    stdno: DataTypes.INTEGER
  }, {});
  Invitation.associate = function(models) {
    // associations can be defined here
  };
  return Invitation;
};