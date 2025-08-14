'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'alice',
        email: 'alice@example.com',
        hashedPassword: 'demo-hash', // placeholder for demo
        firstName: 'Alice',
        lastName: 'A.',
        address: '123 Apple St',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        hashedPassword: 'demo-hash',
        firstName: 'Bob',
        lastName: 'B.',
        address: '456 Banana Ave',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'carol',
        email: 'carol@example.com',
        hashedPassword: 'demo-hash',
        firstName: 'Carol',
        lastName: 'C.',
        address: '789 Cherry Blvd',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: ['alice@example.com', 'bob@example.com', 'carol@example.com']
    }, {});
  }
};
