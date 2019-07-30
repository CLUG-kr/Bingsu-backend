'use strict';
module.exports = (sequelize, DataTypes) => {
  const messageRead = sequelize.define('MessageRead', {
    stdno: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER,
    readUntil: DataTypes.DATE
  }, {});
  messageRead.associate = function(models) {
    // associations can be defined here
  };
  return messageRead;
};