const express = require('express');
const path = require('path');
const router = express.Router();
const apiRouter = require('./api');

// All API routes
router.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../../frontend', 'dist');

  router.use(express.static(distPath));

  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(path.join(distPath, 'index.html'));
  });

  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'production') {

  router.get('/api/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken);
    res.status(200).json({ 'XSRF-Token': csrfToken });
  });

  // Optional ping
  router.get('/hello/world', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
  });
}

module.exports = router;
