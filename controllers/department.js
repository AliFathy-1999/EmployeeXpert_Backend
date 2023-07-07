const Department = require('../DB/models/department');
const Employee = require('../DB/models/employee');
const createDepartment = (data) => Department.create(data);

const getSelectedDepartments = () =>{
  return Department.find({}).select('name');
}
const getManagers = () =>{
  return Department.find({}).populate('managerId', '_id firstName lastName').select('managerId');
}
const getDepartments = (page, limit) =>{
  if (!limit) limit = 10;
  if (!page) page = 1;
 
  return Department.paginate({}, { page, limit });
}
const getDepartmentDetails = (depId) => Department.findOne({ _id : depId}).populate('managerId', 'firstName lastName position')

const updateDepartment = (depId, data) => Department.findOneAndUpdate({ _id : depId }, data, { runValidators : true, new : true });

const deleteDepartment = (depId) => Department.findOneAndDelete({ _id : depId });

const fetchDepEmployees = (depId, page, limit) => {
  if (!limit) limit = 5;
  if (!page) page = 1;
  const selection = '_id firstName lastName userName email position pImage jobType depId' 
  const dep = Department.findOne({ _id : depId })
  const emp = Employee.paginate({depId}, { limit, page, select : selection });
  return Promise.all([dep, emp])
}
module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  getDepartmentDetails,
  fetchDepEmployees,
  getSelectedDepartments,
  getManagers
};
