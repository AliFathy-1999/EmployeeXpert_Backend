const Payroll = require('../DB/models/payroll');

const create = (data) => Payroll.create(data);

const getAllEmployeeSalary = () => Payroll.find();

const getEmployeeSalary = (userId) => Payroll.findById(userId);

module.exports={
    create,
    getAllEmployeeSalary,
    getEmployeeSalary,
}

