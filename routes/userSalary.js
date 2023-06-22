const express = require('express');
const { asycnWrapper }  = require('../lib/index');
const payrollController = require('../controllers/payroll');
const {userAuth} = require('../middlewares/auth');


const router = express.Router();
router.use(userAuth);

router.get('/' , async(req,res,next)=>{
    const employeeSalary= payrollController.getEmployeeSalary(req.employee._id)
    const[err,data] = await asycnWrapper(employeeSalary);
    if(err) return next(err);
    res.status(201).json({status:'success' , data});
})


module.exports=router;