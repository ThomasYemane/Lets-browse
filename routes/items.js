// backend/routes/items.js
const express = require('express');
const { Op } = require('sequelize');
const { Item, User, Category } = require('../db/models');

const router = express.Router();

// GET /api/items?q=&categoryId=&minPrice=&maxPrice=&page=&size=
router.get('/', async (req, res, next) => {
  try {
    const { q, categoryId, minPrice, maxPrice, page = 1, size = 20 } = req.query;

    const where = {};
    if (categoryId) where.categoryId = Number(categoryId);
    if (minPrice || maxPrice) where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice);
    if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    if (q) where.name = { [Op.like]: `%${q}%` };

    const limit = Math.max(1, Math.min(Number(size) || 20, 100));
    const offset = (Math.max(1, Number(page) || 1) - 1) * limit;

    const items = await Item.findAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'username'] },
        { model: Category, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({ items, page: Number(page) || 1, size: limit });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'username'] },
        { model: Category, attributes: ['id', 'name'] }
      ]
    });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
