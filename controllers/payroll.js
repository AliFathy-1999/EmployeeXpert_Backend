const Payroll = require('../DB/models/payroll');
const Employee = require ('../DB/models/employee');
const { paginateSubDocs } = require('mongoose-paginate-v2');

const createEmployeeSalary = async (data) => {
    const payroll = await Payroll.create(data);
    return payroll;
}
  
const updateEmployeeSalaryTable = async (employeeId, grossSalary) => {
    const salary = await Employee.findOneAndUpdate({ _id: employeeId },
      { salary: grossSalary },
      { new: true });
    return salary;
}

const getAllEmployeeSalary = async (page,limit) => {
    if (!limit) limit = 10;
    if (!page) page = 1;
    const paginatedPayroll = await Payroll.paginate({},{ page, limit });
    return paginatedPayroll
}

const getEmployeeSalary = (userId) => Payroll.findOne({employeeId : userId});

const updateEmployeeSalary = (userId, data) => Payroll.findOneAndUpdate({employeeId : userId}, data, {
runValidators : true, new : true});

const deleteEmployeeSalary = (userId) => Payroll.findOneAndDelete({employeeId:userId})

module.exports={
    createEmployeeSalary,
    updateEmployeeSalaryTable,
    getAllEmployeeSalary,
    getEmployeeSalary,
    updateEmployeeSalary,
    deleteEmployeeSalary
}

