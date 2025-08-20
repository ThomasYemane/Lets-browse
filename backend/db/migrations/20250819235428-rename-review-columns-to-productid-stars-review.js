'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // rename old columns to new names
    await queryInterface.renameColumn('Reviews', 'itemId',  'productId');
    await queryInterface.renameColumn('Reviews', 'rating',  'stars');
    await queryInterface.renameColumn('Reviews', 'comment', 'review');

    // add (or re-add) foreign keys
    await queryInterface.addConstraint('Reviews', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_reviews_user',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE', onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Reviews', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'fk_reviews_product',
      references: { table: 'Products', field: 'id' },
      onDelete: 'CASCADE', onUpdate: 'CASCADE'
    });

    // prevent duplicate review by same user for same product (optional but nice)
    await queryInterface.addIndex('Reviews', ['userId', 'productId'], {
      unique: true, name: 'reviews_user_product_unique'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Reviews', 'reviews_user_product_unique');
    await queryInterface.removeConstraint('Reviews', 'fk_reviews_product');
    await queryInterface.removeConstraint('Reviews', 'fk_reviews_user');

    // revert names
    await queryInterface.renameColumn('Reviews', 'productId', 'itemId');
    await queryInterface.renameColumn('Reviews', 'stars',     'rating');
    await queryInterface.renameColumn('Reviews', 'review',    'comment');
  }
};
