// backend/routes/index.js
const router = require('express').Router();
const apiRouter = require('./api');

// Mount the API router under /api
router.use('/api', apiRouter);

// Existing feature routers that are NOT inside /routes/api
router.use('/api/items', require('./items'));
router.use('/api/categories', require('./categories'));

// Dev helpers (optional)
router.get('/hello/world', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({ 'XSRF-Token': csrfToken });
});

module.exports = router;
