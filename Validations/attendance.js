const Joi = require('joi');

const createAttendanceRecord = {
  body: Joi.object().keys({
    employee: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).length(24).required().messages({
      'string.empty': 'Employee ID is required',
      'string.pattern.base': 'Invalid Employee ID',
      'string.length': 'Invalid Employee ID'
    }),
    checkInTimestamp: Joi.date().required().messages({
      'date.base': 'Check-in time must be a valid date',
      'any.required': 'Check-in time is required'
    }),
    checkOutTimestamp: Joi.date().required().messages({
      'date.base': 'Check-out time must be a valid date',
      'any.required': 'Check-out time is required'
    }),
    lateArrival: Joi.boolean().optional().default(false).messages({
      'boolean.base': 'lateArrival must be a boolean value'
    })
  })
};

module.exports = {
  createAttendanceRecord
};