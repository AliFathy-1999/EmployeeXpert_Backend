const jwt = require('jsonwebtoken');
const Attendance = require('../DB/models/attendance');
const { AppError } = require('../lib/index');


const create = (data) =>  Attendance.create(data);


module.exports = {
  create,
};
