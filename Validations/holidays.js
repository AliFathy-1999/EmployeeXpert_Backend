const Joi = require('joi');

const holiday = {
    body : Joi.object().keys({
        holidayName : Joi.string().trim().required().min(3).max(100).messages({
            'string.base' :  'Holiday Name must be a string',
            'string.empty' : 'Holiday Name is required',
            'string.min' :   'Holiday Name must be at least 3 characters',
            'string.max' :   'Holiday Name must be less than 100 characters',
            'any.required' : 'Holiday Name is required'
        }),
        holidayDate : Joi.date().required()
        .messages({
          'date.base' :    'holiday Date must be a valid time',
          'date.empty' :   'holiday Date is required',
          'any.required' : 'holiday Date is required',
        }),
        noOfDays : Joi.number().required().min(0).messages({
            'number.base' :    'Number of holiday Days must be a number',
            'number.empty' :   'Number of holiday Days is required',
            'number.required' : 'Number of holiday Days is required',
            'number.min' : 'Number of holiday Days can not be less than zero'
        })
    })
}

module.exports={
    holiday
}