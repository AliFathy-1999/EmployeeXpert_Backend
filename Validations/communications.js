const Joi = require('joi');

const message = {
    body: Joi.object().required().keys({
        message: Joi.string()
        .trim()
        .required()
        .min(1)
        .messages({
            'string.empty': 'message required field',
            'string.min': 'message required field',    
        }),
        sender:Joi.string()
        .trim()
        .required()
        .regex(/^[a-zA-Z0-9]+$/)
        .min(1)
        .messages({
            'string.empty': 'sender required field',
            'string.min': 'sender required field',    
        }),

        Dep:Joi.string()
        .trim()
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.empty': 'reciever required field',
            'string.min': 'reciever required field',    
        }),

        Emp:Joi.string()
        .trim()
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.empty': 'reciever required field',
            'string.min': 'reciever required field',    
        }),

        All:Joi.boolean()
        .messages({
            'string.empty': 'reciever required field',
            'string.min': 'reciever required field',    
        }),


       
    }),
}

module.exports={
    message,
}


















