'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {

      Review.belongsTo(models.User,    { foreignKey: 'userId' });
      Review.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }

  Review.init({
    userId:    DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    stars:     DataTypes.DECIMAL,  
    review:    DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'Reviews'
  });

  return Review;
};
