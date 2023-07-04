const Joi = require('joi');


const addDepartment = {
    body : Joi.object().keys({
        name : Joi.string().trim().pattern(/^[A-Za-z\s]+$/).min(3).max(50)
        .messages({
            'string.min' :          'Department name must be at least 3 characters',
            'string.max' :          'Department name must be at most 50 characters',
            'string.pattern.base' : 'Department name must contain only alphabet letter ',
        }),
        description : Joi.string().min(5).max(255).pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]*$/).messages({
            'string.min' :          'Description must be at least 2 characters',
            'string.max' :          'Description must be less than 50 characters',
            'string.pattern.base' : 'Description must contains at least one letter and numbers',
          }),
          managerId : Joi.string().length(24).messages({
            'string.empty' :        'Invalid ID',
        }),
    }),  
}

module.exports = {
    addDepartment,
};
