const Joi = require('joi');

const Excuse = {
  body : Joi.object().keys({
  
  reason : Joi.string().trim().min(5).max(200).required()
    .messages({
      'string.base' :  'Reason must be a string',
      'string.empty' : 'Reason is required',
      'string.min' :   'Reason must be at least 5 characters',
      'string.max' :   'Reason must be less than 200 characters',
      'any.required' : 'Reason is required'
    }),
    from : Joi.date().required().format('HH:mm')
    .messages({
      'date.base' :    'Start time must be a valid time',
      'date.empty' :   'Start time is required',
      'any.required' : 'Start time is required',
    }),
  to : Joi.date().required().format('HH:mm').greater(Joi.ref('from'))
    .messages({
      'date.base' :    'End time must be a valid time',
      'date.empty' :   'End time is required',
      'any.required' : 'End time is required',
      'date.greater' : 'End time must be after start time'
    }),
    day : Joi.date().min('now').iso()
    .default(() => new Date(Date.now() + 24 * 60 * 60 * 1000))
    .messages({
      'date.base' :   'Day must be a valid date',
      'date.min' :    'Day must be a future date',
      'date.format' : 'Day must be in ISO format (YYYY-MM-DD)',
      'any.default' : 'Day must be set to tomorrow'
    }),
    noOfExcuses : Joi.number().min(0).required().default(0).messages({
    'number.base' :  'Number of Excuses must be a number',
    'number.min' :   'Number of Excuses must be at least 1',
    'any.required' : 'Number of Excuses is required'
  }),
  respond : Joi.string().valid('Pending', 'Accepted', 'Rejected').default('Pending'),
})
}

module.exports = {Excuse}