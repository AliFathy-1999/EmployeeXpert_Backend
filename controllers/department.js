const Department = require('../DB/models/department');

const createDepartment = (data) => Department.create(data);


module.exports = {
  createDepartment,
};
