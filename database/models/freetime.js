'use strict';
module.exports = (sequelize, DataTypes) => {
  const Freetime = sequelize.define('Freetime', {
    from: DataTypes.STRING,
    until: DataTypes.STRING,
    day: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    shtm: DataTypes.STRING,
    stdno: DataTypes.INTEGER
  }, {});
  Freetime.associate = function(models) {
    // associations can be defined here
  };
  return Freetime;
};