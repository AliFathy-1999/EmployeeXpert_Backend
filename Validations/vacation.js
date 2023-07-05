const Joi = require('joi');

const vacation = {
  body : Joi.object().keys({
  
  reasonForVacation : Joi.string().trim().min(5).max(200).required()
    .messages({
      'string.base' :  'Reason must be a string',
      'string.empty' : 'Reason is required',
      'string.min' :   'Reason must be at least 5 characters',
      'string.max' :   'Reason must be less than 200 characters',
      'any.required' : 'Reason is required'
    }),
  //   fromDay : Joi.date().required().iso()
  //   .messages({
  //     'date.base' :    'Start date must be a valid date',
  //     'date.empty' :   'Start date is required',
  //     'any.required' : 'Start date is required',
  //     'date.isoDate' : 'Start date must be in ISO format (YYYY-MM-DD)'
  //   }),
  // toDay : Joi.date().required().iso().greater(Joi.ref('fromDay'))
  //   .messages({
  //     'date.base' :    'End date must be a valid date',
  //     'date.empty' :   'End date is required',
  //     'any.required' : 'End date is required',
  //     'date.isoDate' : 'End date must be in ISO format (YYYY-MM-DD)',
  //     'date.greater' : 'End date must be after start date'
  //   }),
  totalDays : Joi.number().min(1).max(21).messages({
    'number.base' :  'Total days must be a number',
    'number.min' :   'Total days must be at least 1',
    'number.max' :   'Total days must be less than 21',
    'any.required' : 'Total days is required'
  }),
  status : Joi.string().valid('Pending', 'Accepted', 'Declined').default('Pending'),
})
}

module.exports = {vacation}