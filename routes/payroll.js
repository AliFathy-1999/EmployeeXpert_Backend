const express = require('express');
const { asycnWrapper , AppError}  = require('../lib/index');
const payrollController = require('../controllers/payroll');
const {adminAuth} = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const {payroll} = require('../Validations/payroll')
const Employee = require('../DB/models/employee')


const router = express.Router();
router.use(adminAuth);

router.post('/',validate(payroll), async(req,res,next)=>{
const {body:{
grossSalary,daysWorked,bonus,employeeId
}}=req;

const employee = await Employee.findOne({ _id: employeeId });
if (!employee) {
  return res.status(400).json({ status: 'fail', message: `No Employee with ID ${employeeId}` });
}

const salary = payrollController.createEmployeeSalary({
    grossSalary,daysWorked,bonus,employeeId   
})
const employeeSalary = payrollController.updateEmployeeSalaryTable(employeeId,grossSalary);
const[err,data] = await asycnWrapper(salary,employeeSalary)
if(err) return next(err);
res.status(201).json({ status:'success', data });
})

router.get('/' ,async(req,res,next)=>{
    const employeeSalaries = payrollController.getAllEmployeeSalary();
    const[err,data] = await asycnWrapper(employeeSalaries)
    if(err) return next(err);
    res.status(201).json({status:'success' , data});
})

router.patch('/:id' , async(req,res,next)=>{
    const userId = req.params.id;
    const {grossSalary,bonus} = req.body;
    const validKeys = ['grossSalary', 'bonus'];
    const allowedKeys = Object.keys(req.body);
    const invalidKeys = allowedKeys.filter((key) => !validKeys.includes(key));
    if (invalidKeys.length > 0) {
      return res.status(400).json({ status: 'fail', message: 'Invalid keys to be updated' });
    }
    const employeeUpdate = payrollController.updateEmployeeSalary(userId ,{grossSalary,bonus});
    const employeeSalary= payrollController.updateEmployeeSalaryTable(userId,grossSalary);
    const [err,data] = await asycnWrapper(employeeUpdate,employeeSalary);
    if(err) return next(err);
    if (!data) return next(new AppError (`No Employee with ID ${userId}`, 400));
    res.status(201).json({status:'success' , data});
})

router.delete('/:id' ,async(req,res,next)=>{
    const userId = req.params.id;
    const employeeDelete = payrollController.deleteEmployeeSalary(userId);
    const [err,data] = await asycnWrapper(employeeDelete);
    if(err) return next(err);
    if (!data) return next(new AppError (`No Employee with ID ${userId}`, 400));
    res.status(201).json({status:'success' , data});
})


module.exports=router;