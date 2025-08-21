'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id:         { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },


      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      quantity:   { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },

      createdAt:  { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt:  { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });


    await queryInterface.addIndex('Carts', ['userId', 'productId'], {
      unique: true,
      name: 'cart_user_product_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Carts', 'cart_user_product_unique').catch(() => {});
    await queryInterface.dropTable('Carts');
  }
};
