const Department = require('../DB/models/department');
const Employee = require('../DB/models/employee');
const createDepartment = (data) => Department.create(data);

const getDepartments = (page, limit) =>{
  if (!limit) limit = 5;
  if (!page) page = 1;
 
  return Department.paginate({}, { page, limit });
}
const getDepartmentDatials = (depId) => Department.findOne({_id : depId});

const updateDepartment = (depId, data) => Department.findOneAndUpdate({ _id : depId }, data, { runValidators : true, new : true });

const deleteDepartment = (depId) => Department.findOneAndDelete({ _id : depId });

// const fetchDepEmployees = (depId) => Employee
module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  getDepartmentDatials,
  // fetchDepEmployees
};
