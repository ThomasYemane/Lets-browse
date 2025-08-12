// backend/app.js
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const { restoreUser } = require('./utils/auth');
const routes = require('./routes'); // <-- require routes once, at top

const app = express();

// Basic middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Security middleware
if (!isProduction) {
  app.use(cors());
}
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin'
  })
);
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && 'Lax',
      httpOnly: true
    }
  })
);

// Auth restoration (needs cookies parsed)
app.use(restoreUser);

// Routes (mount once, after middleware)
app.use(routes);

module.exports = app;
