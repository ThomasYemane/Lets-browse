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
const routes = require('./routes');

const app = express();

// Basic middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Security middleware
if (!isProduction) app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(
  csurf({
    cookie: { secure: isProduction, sameSite: isProduction && 'Lax', httpOnly: true }
  })
);

// Auth restoration (needs cookies parsed)
app.use(restoreUser);

// Routes (mount once, after middleware)
app.use(routes);

// ⛔️ 1) Resource Not Found
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = 'Resource Not Found';
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// 🧰 2) Sequelize Validation Error shaping
const { ValidationError } = require('sequelize');
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    const errors = {};
    for (const e of err.errors) errors[e.path] = e.message;
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// 🧾 3) Final Error Formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = app;
