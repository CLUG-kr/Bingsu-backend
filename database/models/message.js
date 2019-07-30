'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('Message', {
    stdno: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    timestamp: DataTypes.DATE
  }, {});
  message.associate = function(models) {
    // associations can be defined here
  };
  return message;
};