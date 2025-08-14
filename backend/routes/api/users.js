const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

/* ===== validation ===== */
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

/* ===== POST /api/users — signup ===== */
router.post('/', validateSignup, async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword });

    await setTokenCookie(res, {
      id: user.id,
      email: user.email,
      username: user.username
    });

    return res.json({
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
