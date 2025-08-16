const router = require('express').Router();
const apiRouter = require('./api');

// Mount all API routes under /api
router.use('/api', apiRouter);

// If items/categories are already inside ./routes/api, do NOT re-mount them here
// (Uncomment only if they are truly *outside* ./routes/api)
// router.use('/api/items', require('./items'));
// router.use('/api/categories', require('./categories'));

// Dev-only helpers
if (process.env.NODE_ENV !== 'production') {
  // Restore CSRF cookie for the frontend dev server
  router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({ 'XSRF-Token': csrfToken }); // ✅ return token in JSON
});

  // Optional ping route
  router.get('/hello/world', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
  });
}

module.exports = router;
