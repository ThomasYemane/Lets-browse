'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      ownerId: { type: Sequelize.INTEGER /*, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' */ },
      categoryId: { type: Sequelize.INTEGER /*, references: { model: 'Categories', key: 'id' }, onDelete: 'SET NULL' */ },
      name: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      price: { type: Sequelize.DECIMAL(10,2) },
      quantity: { type: Sequelize.INTEGER },
      imageUrl: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Products');
  }
};
