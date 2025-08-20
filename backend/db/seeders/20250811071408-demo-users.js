'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'Demo-lition',
        email: 'demo@user.io',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'User',
        address: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition'] }
    }, {});
  }
};
