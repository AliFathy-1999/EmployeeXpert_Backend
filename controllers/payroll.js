const Payroll = require('../DB/models/payroll');

const create = (data) => Payroll.create(data);

const getAllEmployeeSalary = () => Payroll.find();

const getEmployeeSalary = (userId) => Payroll.findOne({employeeId : userId})

const updateEmployeeSalary = (userId, data) => Payroll.findOneAndUpdate({employeeId : userId}, data, {
runValidators : true, new : true});

const deleteEmployeeSalary = (userId) => Payroll.findOneAndDelete({employeeId : userId})

module.exports = {
    create,
    getAllEmployeeSalary,
    getEmployeeSalary,
    updateEmployeeSalary,
    deleteEmployeeSalary
}

