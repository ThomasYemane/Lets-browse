// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

/**
 * POST /api/session
 * Log in with username OR email + password
 */
router.post('/', async (req, res, next) => {
  try {
    const { credential, password } = req.body;

    // Find by username OR email (need unscoped to read hashedPassword)
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: [{ username: credential }, { email: credential }]
      }
    });

    // Invalid user or bad password
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      throw err;
    }

    // Issue token cookie
    await setTokenCookie(res, {
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.json({
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/session
 * Return current session user (or null)
 */
router.get('/', (req, res) => {
  const { user } = req; // set by restoreUser in api/index.js
  if (!user) return res.json({ user: null });
  return res.json({
    user: { id: user.id, email: user.email, username: user.username }
  });
});

/**
 * DELETE /api/session
 * Log out (clear token cookie)
 */
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});

module.exports = router;
