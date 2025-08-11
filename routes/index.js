// backend/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/api/items', require('./items'));
router.use('/api/categories', require('./categories'));


router.get('/hello/world', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({ 'XSRF-Token': csrfToken });
});

// 👉 mount items routes here
router.use('/api/items', require('./items'));

module.exports = router;
