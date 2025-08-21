// backend/routes/api/cart.js
const router = require('express').Router();
const { requireAuth } = require('../../utils/auth');
const { Cart, Product } = require('../../db/models');

// GET /api/cart → current user's cart items
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const items = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, attributes: ['id','name','price','imageUrl'] }],
      order: [['createdAt','DESC']]
    });
    res.json({ items });
  } catch (e) { next(e); }
});

// POST /api/cart { productId, quantity }
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    // Upsert-by (userId, productId) if you want only one row per product
    const [row, created] = await Cart.findOrCreate({
      where: { userId: req.user.id, productId },
      defaults: { quantity }
    });
    if (!created) await row.update({ quantity: row.quantity + Number(quantity || 1) });

    const withProduct = await Cart.findByPk(row.id, {
      include: [{ model: Product, attributes: ['id','name','price','imageUrl'] }]
    });
    res.status(created ? 201 : 200).json(withProduct);
  } catch (e) { next(e); }
});

// PATCH /api/cart/items/:id { quantity }
router.patch('/items/:id', requireAuth, async (req, res, next) => {
  try {
    const row = await Cart.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Cart item not found' });
    if (row.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const qty = Number(req.body.quantity);
    if (!Number.isFinite(qty) || qty < 1) return res.status(400).json({ message: 'quantity must be >= 1' });

    await row.update({ quantity: qty });
    res.json(row);
  } catch (e) { next(e); }
});

// DELETE /api/cart/items/:id
router.delete('/items/:id', requireAuth, async (req, res, next) => {
  try {
    const row = await Cart.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Cart item not found' });
    if (row.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await row.destroy();
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
