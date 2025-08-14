'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Item extends Model {
    static associate(models) {
      // 👇 this line fixes your error
      this.belongsTo(models.User, { as: 'owner', foreignKey: 'ownerId' });

      // optional but recommended
      this.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }

  Item.init({
    ownerId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10,2),
    quantity: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, { sequelize, modelName: 'Item' });

  return Item;
};
