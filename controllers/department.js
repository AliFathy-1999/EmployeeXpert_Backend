const jwt = require('jsonwebtoken');
const Department = require('../DB/models/department');
const { AppError } = require('../lib/index');


const create = (data) =>  Department.create(data);


module.exports = {
  create,
};
