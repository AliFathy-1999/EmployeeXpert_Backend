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

// const updateEmployeePayRate = async (employeeId, payRate) => {
//     const payRate = await Attendence.findOneAndUpdate({ employee: employeeId },
//       { payRate: payRate },
//       { new: true });
//     return payRate;
// }


const getAllEmployeeSalary = async (page,limit) => {
    if (!limit) limit = 10;
    if (!page) page = 1;
    const paginatedPayroll = await Payroll.paginate({},{ page, limit });
    return paginatedPayroll
}

const getEmployeeSalary = (userId) => {
    const employeePayroll = Payroll.findOne({employeeId : userId}).populate({
    path :   'employeeId',
    select : 'firstName lastName nationalId position phoneNumber',
  }).exec();
  return employeePayroll;
};

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

