const Joi = require('joi');

const payroll = {
    body : Joi.object().keys({
        grossSalary : Joi.number().min(3500).max(200000).messages({
            'number.min' : 'Gross Salary must be at least 3500 EGP according to minimum wage in Egypt',
        }),
        bonus : Joi.number().min(0).default(0).messages({
            'number.min' : 'Bonus Cannot be less than 0'
        }), 
    }) 
}

module.exports = {
    payroll,
}