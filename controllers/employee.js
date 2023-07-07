const jwt = require('jsonwebtoken');
const Employee = require('../DB/models/employee');
const { AppError } = require('../lib/index');
const Payroll = require('../DB/models/payroll')
const generateToken = (employee) => {
  const token = jwt.sign({ userName : employee.userName, userId : employee._id, role : employee.role}, process.env.TOKEN_KEY, { expiresIn : '7d' } )
  return token;
}

const getEmployees = (role = 'USER', page, limit) => {
  if (!limit) limit = 5;
  if (!page) page = 1;
 
  return Employee.paginate({role}, { page, limit,  populate: { path: 'depId', select: 'name' }, });
}

const employeeDetails = (empId) => Employee.find({_id : empId}).populate('depId', 'name')


const getMe = (empId) => Employee.findOne({_id : empId});

const createEmployee = (data) => {
  return new Promise((resolve, reject) => {
    Employee.create(data).then((employee) => {
      Payroll.create({
        grossSalary: employee.salary,
        employeeId: employee._id,
        daysWorked: 0
      }).then(() => {
        resolve(employee);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

const updateEmployee = (empId, data) => Employee.findOneAndUpdate({ _id : empId }, data, { runValidators : true, new : true });

const deleteEmployee = (empId) => 
  Employee.findOneAndDelete({
    $and : [
      { _id : empId },
      { role : 'USER' }
    ]
});

const searchOnEmployee = (searchText, page, limit)=> {
    return Employee.paginate(
      {'firstName' : { $regex : searchText, $options : 'i'}},
      { page, limit }
  )
  
}
const getSelectedEmployees = ()=>{
  return Employee.find({}).select('_id firstName lastName')
}
const signIn = async (employee) => {
  const user = await Employee.findOne({ userName : employee.userName})
  if(!user) throw new AppError('Invalid username', 400);
  const valid = user.verifyPassword(employee.password);
  if (!valid) throw new AppError('Invalid password', 400);
  return {token : generateToken(user), user}
}

const countEmployee = () => {
  const employee = Employee.find({}).countDocuments();
  return employee;
}

module.exports = {
  getEmployees,
  employeeDetails,
  getMe,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchOnEmployee,
  signIn,
  getSelectedEmployees,
  countEmployee
};
