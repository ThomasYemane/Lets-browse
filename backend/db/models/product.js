'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {

      Product.belongsTo(models.User, { as: 'owner', foreignKey: 'ownerId' });
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' });

      Product.hasMany(models.Review, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Product.hasMany(models.Wishlist, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
        hooks: true
      });

      if (models.Cart) {
        Product.hasMany(models.Cart, {
          foreignKey: 'productId',
          onDelete: 'CASCADE',
          hooks: true
        });
      }
    }
  }

  Product.init({
    ownerId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10,2),
    quantity: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products'
  });

  return Product;
};
