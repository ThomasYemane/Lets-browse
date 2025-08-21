// backend/routes/api/wishlist.js
const router = require('express').Router();
const { requireAuth } = require('../../utils/auth');
const { Wishlist, Product } = require('../../db/models');

// GET /api/wishlist  → current user's wishlist
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const rows = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, attributes: ['id','name','price','imageUrl'] }],
      order: [['createdAt','DESC']]
    });
    res.json({ wishlist: rows });
  } catch (e) { next(e); }
});

// POST /api/wishlist  { productId }
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    const entry = await Wishlist.create({ userId: req.user.id, productId });
    const withProduct = await Wishlist.findByPk(entry.id, {
      include: [{ model: Product, attributes: ['id','name','price','imageUrl'] }]
    });
    res.status(201).json(withProduct);
  } catch (e) { next(e); }
});

// DELETE /api/wishlist/:id
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const row = await Wishlist.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Wishlist item not found' });
    if (row.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await row.destroy();
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
