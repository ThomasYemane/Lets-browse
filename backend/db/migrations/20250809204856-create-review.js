'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id:         { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },

      // FK -> Users(id)
      userId:     {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      // FK -> Products(id)
      productId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      // review fields
      stars:      { type: Sequelize.INTEGER, allowNull: false },   // 1–5 (you can add a CHECK later if you want)
      review:     { type: Sequelize.TEXT,    allowNull: false },

      createdAt:  { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt:  { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // Optional but common: one review per user per product
    await queryInterface.addIndex('Reviews', ['userId','productId'], {
      unique: true,
      name: 'review_user_product_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Reviews');
  }
};
