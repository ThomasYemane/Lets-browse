const express = require('express');
const router = express.Router();

router.get('/hello/world', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({ 'XSRF-Token': csrfToken });
});

// existing
router.use('/api/items', require('./items'));
router.use('/api/categories', require('./categories'));

// new
router.use('/api/session', require('./session'));
router.use('/api/users', require('./users'));

router.use('/api/users', require('./users'));


module.exports = router;
