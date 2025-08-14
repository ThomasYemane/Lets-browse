// backend/routes/api/index.js
const router = require('express').Router();
const { restoreUser, requireAuth, setTokenCookie } = require('../../utils/auth');

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

// ----- TEMPORARY AUTH TEST ROUTES -----
const { User } = require('../../db/models');

// 1) set a token for Demo user
router.get('/set-token-cookie', async (_req, res) => {
  const demo = await User.findOne({ where: { username: 'Demo-lition' } });
  setTokenCookie(res, demo);
  res.json({ user: { id: demo.id, username: demo.username, email: demo.email } });
});

// 2) restore user (returns req.user or null)
router.get('/restore-user', (req, res) => {
  res.json(req.user);
});

// 3) require auth
router.get('/require-auth', requireAuth, (req, res) => {
  res.json(req.user);
});
// ----- END TEMPORARY AUTH TEST ROUTES -----

module.exports = router;
