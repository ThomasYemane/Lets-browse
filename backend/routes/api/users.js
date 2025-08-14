// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

/**
 * POST /api/users
 * Signup new user
 */
router.post('/', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Create user (let model/db constraints handle uniqueness)
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword });

    // Log them in with a cookie
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

module.exports = router;
