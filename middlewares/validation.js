
const { ValidationError } = require('joi');
const { AppError } = require('../lib/appError');

const validate = (schema) => async (req, res, next) => {
  const validationErr = [];
  ['body', 'params', 'query'].forEach((key) => {
    if (schema[key]) {
      const validation = schema[key].validate(req[key]);
      if (validation.error) {
        validationErr.push(validation.error);
      }
    }
  });
  if (validationErr.length) {
    next(new AppError(validationErr[0].details[0].message, 400));
  } else {
    next();
  }
};
module.exports = { validate };
