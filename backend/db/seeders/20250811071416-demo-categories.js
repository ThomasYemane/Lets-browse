'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      { name: 'Electronics', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Home & Kitchen', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Books', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fashion', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {
      name: ['Electronics','Home & Kitchen','Books','Fashion']
    }, {});
  }
};
