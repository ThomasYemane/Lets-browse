// backend/routes/api/index.js
const router = require('express').Router();
const { restoreUser } = require('../../utils/auth');

const sessionRouter = require('./session');
const usersRouter = require('./users');

// Make req.user available on all /api routes
router.use(restoreUser);

// Keep this test route for later frontend setup
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// Auth sub-routers
router.use('/session', sessionRouter);
router.use('/users', usersRouter);

module.exports = router;
