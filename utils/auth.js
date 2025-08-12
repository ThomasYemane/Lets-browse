// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// create & set JWT cookie
const setTokenCookie = (res, user) => {
  const safeUser = { id: user.id, username: user.username, email: user.email };
  const token = jwt.sign(safeUser, secret, { expiresIn: parseInt(expiresIn, 10) });
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    maxAge: parseInt(expiresIn, 10) * 1000,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'Lax' : 'Lax'
  });
  return token;
};

// restore user from cookie
const restoreUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return next();
  try {
    const data = jwt.verify(token, secret);
    const user = await User.findByPk(data.id, { attributes: ['id','username','email'] });
    req.user = user || null;
  } catch {
    req.user = null;
  }
  return next();
};

// require auth guard
const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });
  return next();
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
    