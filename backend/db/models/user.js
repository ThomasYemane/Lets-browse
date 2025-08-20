'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      User.hasMany(models.Product, { as: 'products', foreignKey: 'ownerId' });

      User.hasMany(models.Review,   { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
      User.hasMany(models.Wishlist, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
      User.hasMany(models.Cart,     { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
    }
  }

  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedPassword: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  });

  return User;
};
