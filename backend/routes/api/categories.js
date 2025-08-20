const express = require('express');
const { Category } = require('../../db/models');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['name','ASC']] });
    res.json({ categories });
  } catch (e) { next(e); }
});

module.exports = router;
