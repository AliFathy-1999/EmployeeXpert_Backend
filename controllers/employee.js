const jwt = require('jsonwebtoken');
const Employee = require('../DB/models/employee');
const { AppError } = require('../lib/index');

const generateToken = (employee) => {
  const token = jwt.sign({ userName: employee.userName, userId:employee._id, role:employee.role} , process.env.TOKEN_KEY, { expiresIn: '7d' } )
  return token;
}

const getEmployees = (role="USER") => Employee.find({role})

const employeeDetails = (empId) => Employee.findOne({_id: empId})

const getMe = (empId) => Employee.findOne({_id:empId});

const createEmployee = (data) =>  Employee.create(data);

const updateEmployee = (empId,data) => Employee.findOneAndUpdate({ _id : empId } , data, { runValidators:true,new: true });

const deleteEmployee = (empId) => {
  const empExist = Employee.findOne({ _id : empId })
  console.log(empExist);
  return Employee.findOneAndDelete({
  $and:[
    { _id : empId },
    { role: 'USER' }
  ]
});
}

const signIn = async (employee) => {
  const user = await Employee.findOne({ userName : employee.userName})
  if(!user)  throw new AppError('Invalid username', 400);
  const valid = user.verifyPassword(employee.password);
  if (!valid) throw new AppError('Invalid password', 400);
  return {token: generateToken(user), user}
  
}

module.exports = {
  getEmployees,
  employeeDetails,
  getMe,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  signIn,
};
