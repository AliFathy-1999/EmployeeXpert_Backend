const Joi = require('joi');

<<<<<<< HEAD
const payroll={
    grossSalary:Joi.number().min(3500).max(200000).required().messages({
        'number.min' : 'Gross Salary must be at least 3500 EGP according to minimum wage in Egypt',
    }),
    bonus:Joi.number().min(0).default(0).messages({
        'number.min' : 'Bonus Cannot be less than 0'
    }),  
=======
const payroll = {
    body : Joi.object().keys({
        grossSalary : Joi.number().min(3500).messages({
            'number.min' : 'Gross Salary must be at least 3500 EGP according to minimum wage in Egypt',
        }),
        bonus : Joi.number().min(0).default(0).messages({
            'number.min' : 'Bonus Cannot be less than 0'
        }), 
    }) 
>>>>>>> 2e8f7a510fd82f51027f644ada4da92f787d1e3a
}

module.exports = {
    payroll,
}