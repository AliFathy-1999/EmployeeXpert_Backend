const Joi = require('joi');

const paginationOptions = {
  query : Joi.object().keys({
    page :    Joi.number().min(1),
    limit :   Joi.number().min(1),
    keyWord : Joi.string().regex(/^[a-zA-Z2-9\s]*$/).trim().min(3).max(30),
  }),
};


module.exports = {
    employeesValidator :  require('./employee'),
    departmentValidator : require('./department'),
    payrollValidator :    require('./payroll'),
    vacationValidator :   require('./vacation'),
    lateValidator :       require('./Excuse'),
    holidayValidator :    require('./holidays'),
    paginationOptions
};
  