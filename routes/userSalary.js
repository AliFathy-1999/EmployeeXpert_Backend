const express = require('express');
const { asycnWrapper , AppError }  = require('../lib/index');
const payrollController = require('../controllers/payroll');
const {Auth} = require('../middlewares/auth');


const router = express.Router();

router.get('/' , Auth, async(req,res,next)=>{
    const userId=req.user._id
    const employeeSalary= payrollController.getEmployeeSalary(userId)
    const[err,data] = await asycnWrapper(employeeSalary);
    if(err) return next(err);
    if (!data) return next(new AppError (`No Employee with ID ${userId}`, 400));
    res.status(200).json({status:'success' , data});
})


module.exports=router;