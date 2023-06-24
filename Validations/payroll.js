const Joi = require('joi');

const payroll={
    grossSalary:Joi.number().min(0).required().messages({
        'number.min':'Gross Salary Cannot be less than 0'
    }),
    bonus:Joi.number().min(0).messages({
        'number.min':'Bonus Cannot be less than 0'
    }),
    
}

module.exports={
    payroll,
}