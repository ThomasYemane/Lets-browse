'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // items posted by this user
      this.hasMany(models.Item, { foreignKey: 'ownerId', as: 'items' });
    }
  }

  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING
  }, { sequelize, modelName: 'User' });

  return User;
};
