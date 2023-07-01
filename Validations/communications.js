const Joi = require('joi');

const message = {
    body : Joi.object().required().keys({
        title : Joi.string().min(5).max(100).trim().pattern(/^[A-Za-z\s]+$/)
        .messages({
          'string.min' :          'Title must be at least 5 characters',
          'string.max' :          'Title must be less than 100 characters',
          'string.pattern.base' : 'Title should contain alphabetic characters only',
        }),
        message : Joi.string()
        .trim()
        .min(5)
        .max(300)
        .pattern(/[a-zA-Z0-9]+/)
        .messages({
            'string.min' :          'Message must be at least 5 characters long',
            'string.max' :          'Message cannot exceed 300 characters',
            'string.pattern.base' : 'Message must contain at least one alphabetic character',   
        }),
        department : Joi.string()
        .trim()
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.empty' : 'reciever required field',
            'string.min' :   'reciever required field',    
        }),
        employee : Joi.string()
        .trim()
        .pattern(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.empty' :        'reciever required field',
            'string.min' :          'reciever required field', 
            'string.pattern.base' : 'Invalid Employee ID',   
        }),
        isForAll : Joi.boolean().default(false)
       
    }),
}

module.exports = {
    message,
}


