const express = require('express');
const router = express.Router();
const { Review, Product, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation'); 


const validateReview = [
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  check('review')
    .isLength({ min: 1 })
    .withMessage('Review text is required'),
  handleValidationErrors
];

// GET /api/reviews/product/:productId
router.get('/product/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findAll({
      where: { productId },
      include: [{ model: User, attributes: ['id', 'username'] }]
    });
    res.json({ reviews });
  } catch (e) {
    next(e);
  }
});

// POST /api/reviews
router.post('/', requireAuth, validateReview, async (req, res, next) => {
  try {
    const { productId, stars, review } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newReview = await Review.create({
      userId: req.user.id,
      productId,
      stars,
      review
    });
    res.status(201).json({ review: newReview });
  } catch (e) {
    next(e);
  }
});

// PUT /api/reviews/:id
router.put('/:id', requireAuth, validateReview, async (req, res, next) => {
  try {
    const { stars, review } = req.body;
    const existing = await Review.findByPk(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Review not found' });
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await existing.update({ stars, review });
    res.json({ review: existing });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const existing = await Review.findByPk(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Review not found' });
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await existing.destroy();
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
