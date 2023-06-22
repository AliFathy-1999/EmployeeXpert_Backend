const express = require('express');
const { asycnWrapper }  = require('../lib/index');
const payrollController = require('../controllers/payroll');
const {adminAuth} = require('../middlewares/auth');


const router = express.Router();

router.post('/', adminAuth, async(req,res,next)=>{

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



module.exports=router;