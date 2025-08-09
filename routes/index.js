// backend/routes/index.js
const express = require('express');
const router = express.Router();

// Dev-only test route (optional)
router.get('/hello/world', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

// CSRF restore route (for frontend to grab a token in dev)
router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({ 'XSRF-Token': csrfToken });
});

module.exports = router;
