const express = require('express');
const { Op } = require('sequelize');
const { Item, User, Category } = require('../db/models');
const { requireAuth } = require('../utils/auth');


const router = express.Router();

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

// requires login
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, description, categoryId, price, quantity, imageUrl } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: 'name and price are required' });
    }

    const item = await Item.create({
      ownerId: req.user.id,                // from JWT
      categoryId: categoryId || null,
      name,
      description: description || '',
      price,
      quantity: quantity ?? 0,
      imageUrl: imageUrl || null
    });

    // return with relations populated
    const created = await Item.findByPk(item.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'username'] },
        { model: Category, attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /api/items/:id  — owner-only
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // ownership check
    if (item.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: not your item' });
    }

    const { name, description, categoryId, price, quantity, imageUrl } = req.body;
    if (name !== undefined && !name) {
      return res.status(400).json({ message: 'name cannot be empty' });
    }
    if (price !== undefined && price === null) {
      return res.status(400).json({ message: 'price cannot be null' });
    }

    await item.update({
      name: name ?? item.name,
      description: description ?? item.description,
      categoryId: categoryId ?? item.categoryId,
      price: price ?? item.price,
      quantity: quantity ?? item.quantity,
      imageUrl: imageUrl ?? item.imageUrl
    });

    const updated = await Item.findByPk(id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'username'] },
        { model: Category, attributes: ['id', 'name'] }
      ]
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/items/:id — owner-only
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: not your item' });
    }

    await item.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});



module.exports = router;
