const jwt = require('jsonwebtoken');
const Employee = require('../DB/models/employee');
const { AppError } = require('../lib/index');


const create = (data) =>  Employee.create(data);


module.exports = {
  create,
};
