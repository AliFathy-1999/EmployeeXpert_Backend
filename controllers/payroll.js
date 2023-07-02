const Payroll = require("../DB/models/payroll");
const Employee = require("../DB/models/employee");
const { paginateSubDocs } = require("mongoose-paginate-v2");
const schedule = require('node-schedule');

const createEmployeeSalary = async (data) => {
  const payroll = await Payroll.create(data);
  return payroll;
};

const updateEmployeeSalaryTable = async (employeeId, grossSalary) => {
  const salary = await Employee.findOneAndUpdate(
    { _id: employeeId },
    { salary: grossSalary },
    { new: true }
  );
  return salary;
};

// const updateEmployeePayRate = async (employeeId, payRate) => {
//     const payRate = await Attendence.findOneAndUpdate({ employee: employeeId },
//       { payRate: payRate },
//       { new: true });
//     return payRate;
// }

const getAllEmployeeSalary = async (page, limit) => {
  if (!limit) limit = 10;
  if (!page) page = 1;

  const options = {
    page: page,
    limit: limit,
    populate: {
      path: "employeeId",
      select: "firstName lastName position",
    },
  };

  const paginatedPayroll = await Payroll.paginate({}, options);
  return paginatedPayroll;
};

const getEmployeeSalary = (userId) => {
  const employeePayroll = Payroll.findOne({ employeeId: userId })
    .populate({
      path: "employeeId",
      select: "firstName lastName position",
    })
    .exec();
  return employeePayroll;
};

const updateEmployeeSalary = (userId, data) =>
  Payroll.findOneAndUpdate({ employeeId: userId }, data, {
    runValidators: true,
    new: true,
  });

const deleteEmployeeSalary = (userId) =>
  Payroll.findOneAndDelete({ employeeId: userId });

  


module.exports = {
  createEmployeeSalary,
  updateEmployeeSalaryTable,
  getAllEmployeeSalary,
  getEmployeeSalary,
  updateEmployeeSalary,
  deleteEmployeeSalary,
};
