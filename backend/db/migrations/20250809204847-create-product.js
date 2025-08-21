'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },

      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,  // SET NULL requires nullable
        references: { model: 'Categories', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },

      name:        { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      price:       { type: Sequelize.DECIMAL(10,2), allowNull: false },
      quantity:    { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      imageUrl:    { type: Sequelize.STRING },
      createdAt:   { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt:   { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Products');
  }
};
