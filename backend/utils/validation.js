const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors.array().forEach(err => { errors[err.path] = err.msg; });
    const e = Error('Bad request.');
    e.status = 400;
    e.title = 'Bad request.';
    e.errors = errors;
    return next(e);
  }
  return next();
};

module.exports = { handleValidationErrors };
