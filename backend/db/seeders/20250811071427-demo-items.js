'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Items', [
      // ownerId 1 = alice
      {
        ownerId: 1,
        categoryId: 1, // Electronics
        name: 'Wireless Headphones',
        description: 'Over-ear, noise-cancelling, 30h battery.',
        price: 79.99,
        quantity: 10,
        imageUrl: 'https://picsum.photos/seed/headphones/400/300',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 1,
        categoryId: 3, // Books
        name: 'JavaScript Patterns',
        description: 'A handy guide to JS patterns.',
        price: 19.50,
        quantity: 5,
        imageUrl: 'https://picsum.photos/seed/book/400/300',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ownerId 2 = bob
      {
        ownerId: 2,
        categoryId: 2, // Home & Kitchen
        name: 'Nonstick Frying Pan',
        description: 'Durable, oven-safe up to 400°F.',
        price: 24.99,
        quantity: 12,
        imageUrl: 'https://picsum.photos/seed/pan/400/300',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        categoryId: 4, // Fashion
        name: 'Classic Hoodie',
        description: 'Soft cotton blend hoodie.',
        price: 34.00,
        quantity: 20,
        imageUrl: 'https://picsum.photos/seed/hoodie/400/300',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ownerId 3 = carol
      {
        ownerId: 3,
        categoryId: 1, // Electronics
        name: 'Portable Charger 20k mAh',
        description: 'USB-C fast charge power bank.',
        price: 29.99,
        quantity: 15,
        imageUrl: 'https://picsum.photos/seed/powerbank/400/300',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 3,
        categoryId: 2, // Home & Kitchen
        name: 'Stainless Steel Water Bottle',
        description: 'Vacuum insulated, 24oz.',
        price: 17.25,
        quantity: 30,
        imageUrl: 'https://picsum.photos/seed/bottle/400/300',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', {
      name: [
        'Wireless Headphones',
        'JavaScript Patterns',
        'Nonstick Frying Pan',
        'Classic Hoodie',
        'Portable Charger 20k mAh',
        'Stainless Steel Water Bottle'
      ]
    }, {});
  }
};
