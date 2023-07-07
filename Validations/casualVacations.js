const Joi = require('joi');

const casualVacation = {
  body : Joi.object().keys({
  
  reasonForVacation : Joi.string().trim().default('casual Vacation')
    .messages({
      'string.base' :  'Reason must be a string',
    }),
    Day: Joi.date().iso().default(() => new Date(Date.now() + 24 * 60 * 60 * 1000)),
    totalCasDays: Joi.number().max(2).default(1),

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
casualVacation:Joi.number().min(0).max(7).default(0).messages({
  'number.base' :  'casual Vacations must be a number',
  'number.min' :   'casual Vacations must be at least 0',
  'number.max' :   'casual Vacations must be less than or equal 7',
}),
}

module.exports = {casualVacation}