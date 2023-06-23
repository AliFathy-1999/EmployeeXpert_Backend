const express = require('express');
const { asycnWrapper , AppError}  = require('../lib/index');
const payrollController = require('../controllers/payroll');
const {adminAuth} = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const {payroll} = require('../Validations/payroll')

const router = express.Router();

router.post('/', adminAuth, validate(payroll), async(req,res,next)=>{

const {body:{
grossSalary,daysWorked,bonus,employeeId
}}=req;
const salary = payrollController.create({
    grossSalary,daysWorked,bonus,employeeId   
})
const[err,data]=await asycnWrapper(salary)

if(err) return next(err);
res.status(201).json({ status:'success', data });

})

router.get('/' , adminAuth , async(req,res,next)=>{
    const employeeSalaries = payrollController.getAllEmployeeSalary();
    const[err,data] = await asycnWrapper(employeeSalaries)
    if(err) return next(err);
    res.status(201).json({status:'success' , data});
})

router.patch('/:id' , adminAuth , async(req,res,next)=>{
    const userId = req.params.id;
    const {grossSalary,daysWorked,bonus} = req.body;
    const employeeUpdate = payrollController.updateEmployeeSalary(userId ,{grossSalary,daysWorked,bonus});
    const [err,data] = await asycnWrapper(employeeUpdate);
    if(err) return next(err);
    if (!data) return next(new AppError (`No Employee with ID ${userId}`, 400));
    res.status(201).json({status:'success' , data});
})

router.delete('/:id' , adminAuth , async(req,res,next)=>{
    const userId = req.params.id;
    const employeeDelete = payrollController.deleteEmployeeSalary(userId);
    const [err,data] = await asycnWrapper(employeeDelete);
    if(err) return next(err);
    if (!data) return next(new AppError (`No Employee with ID ${userId}`, 400));
    res.status(201).json({status:'success' , data});
})


module.exports=router;