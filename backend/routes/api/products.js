const express = require('express');
const { Op } = require('sequelize');
const { Product, User, Category } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// GET /api/products
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

    const products = await Product.findAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'username'] },
        { model: Category, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({ products, page: Number(page) || 1, size: limit });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'username'] },
        { model: Category, attributes: ['id', 'name'] }
      ]
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products (requires login)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, description, categoryId, price, quantity, imageUrl } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: 'name and price are required' });
    }

    const product = await Product.create({
      ownerId: req.user.id,                // from auth middleware
      categoryId: categoryId || null,
      name,
      description: description || '',
      price,
      quantity: quantity ?? 0,
      imageUrl: imageUrl || null
    });

    const created = await Product.findByPk(product.id, {
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

// PUT /api/products/:id (owner-only)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: not your product' });
    }

    const { name, description, categoryId, price, quantity, imageUrl } = req.body;
    if (name !== undefined && !name) {
      return res.status(400).json({ message: 'name cannot be empty' });
    }
    if (price !== undefined && price === null) {
      return res.status(400).json({ message: 'price cannot be null' });
    }

    await product.update({
      name: name ?? product.name,
      description: description ?? product.description,
      categoryId: categoryId ?? product.categoryId,
      price: price ?? product.price,
      quantity: quantity ?? product.quantity,
      imageUrl: imageUrl ?? product.imageUrl
    });

    const updated = await Product.findByPk(id, {
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

// DELETE /api/products/:id (owner-only)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: not your product' });
    }

    await product.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
