const jwt = require('jsonwebtoken');
const Employee = require('../DB/models/employee');
const { AppError } = require('../lib/index');

const generateToken = (employee) => {
  const token = jwt.sign({ userName: employee.userName, userId:employee._id, role:employee.role} , process.env.TOKEN_KEY, { expiresIn: '7d' } )
  return token;
}
const create = (data) =>  Employee.create(data);

const signIn = async (employee) => {
  const user = await Employee.findOne({ userName : employee.userName})
  if(!user)  throw new AppError('Invalid username', 400);
  const valid = user.verifyPassword(employee.password);
  if (!valid) throw new AppError('Invalid password', 400);
  return {token: generateToken(user), user}
  
}

module.exports = {
  create,
  signIn
};
