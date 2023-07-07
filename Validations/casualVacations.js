const Joi = require('joi');

const casualVacation = {
  body : Joi.object().keys({
  
  reasonForVacation : Joi.string().trim().default('casual Vacation').required()
    .messages({
      'string.base' :  'Reason must be a string',
    }),
    Day : Joi.date().required().iso()
    .messages({
      'date.base' :    'Start date must be a valid date',
      'date.empty' :   'Start date is required',
      'any.required' : 'Start date is required',
      'date.isoDate' : 'Start date must be in ISO format (YYYY-MM-DD)'
    }),
//   toDay : Joi.date().required().iso().greater(Joi.ref('fromDay'))
//     .messages({
//       'date.base' :    'End date must be a valid date',
//       'date.empty' :   'End date is required',
//       'any.required' : 'End date is required',
//       'date.isoDate' : 'End date must be in ISO format (YYYY-MM-DD)',
//       'date.greater' : 'End date must be after start date'
//     }),
  status : Joi.string().default('Accepted'),
}),
casualVacation:Joi.number().min(0).max(7).messages({
  'number.base' :  'casual Vacations must be a number',
  'number.min' :   'casual Vacations must be at least 0',
  'number.max' :   'casual Vacations must be less than or equal 7',
  'any.required' : 'casual Vacations is required'
}),
}

module.exports = {casualVacation}