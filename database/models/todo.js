'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    teamId: DataTypes.INTEGER,
    stdno: DataTypes.INTEGER,
    name: DataTypes.STRING,
    deadline: DataTypes.DATE,
    checked: {type: DataTypes.BOOLEAN, defaultValue: false}
  }, {});
  Todo.associate = function(models) {
    // associations can be defined here
  };
  return Todo;
};