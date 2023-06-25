const Department = require('../DB/models/department');

const createDepartment = (data) => Department.create(data);

const getDepartments = (page, limit) =>{
  if (!limit) limit = 5;
  if (!page) page = 1;
 
  return Department.paginate({}, { page, limit });
}
module.exports = {
  createDepartment,
  getDepartments,
};
