const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User } = require('../db/models');
const { setTokenCookie, restoreUser } = require('../utils/auth');
const router = express.Router();


// Login
router.post('/', async (req, res, next) => {
  try {
    const { credential, password } = req.body; // username or email
    if (!credential || !password) return res.status(400).json({ message: 'Credential and password required' });

    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: credential }, { email: credential }]
      }
    });
    if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    setTokenCookie(res, user);
    res.json({ user: { id: user.id, username: user.username, email: user.email } });
  } catch (e) { next(e); }
});

// Logout
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});

// GET /api/session  (restore)
router.get('/', restoreUser, (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({ user: req.user });
});

// DELETE /api/session  (logout)
router.delete('/', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'success' });
});

module.exports = router;
