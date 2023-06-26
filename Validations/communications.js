const Joi = require('joi');

const message = {
    body: Joi.object().required().keys({
        message: Joi.string()
        .trim()
        .required()
        .regex(/^[a-zA-Z]+$/)
        .min(1)
        .messages({
            'string.empty': 'message required field',
            'string.min': 'message required field',
            
        }),
       
    }),
}


















