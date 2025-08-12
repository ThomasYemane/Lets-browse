const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../db/models');
const { setTokenCookie } = require('../utils/auth');

const router = express.Router();

// POST /api/users  -> sign up
router.post('/', async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' });
    }

    // create user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      username,
      email,
      hashedPassword,
      firstName,
      lastName
    });

    // set JWT cookie and return safe user
    setTokenCookie(res, user);
    return res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Username or email already in use' });
    }
    next(err);
  }
});

module.exports = router;
