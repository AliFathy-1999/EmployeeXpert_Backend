const express = require('express');
const { asycnWrapper} = require('../lib/index');
const payrollHistoryController = require('../controllers/payrollHistory');
const {adminAuth, Auth} = require('../middlewares/auth');

const router = express.Router();

router.get('/all' , adminAuth , async(req,res,next)=>{
    const {limit , page} = req.query;
    const getAllPayrollHistory = payrollHistoryController.getAllEmployeesPayroll(limit , page);
    const [err,data] = await asycnWrapper(getAllPayrollHistory)
    if(err) return next(err);
    res.status(200).json({status:'success' , data})
})

module.exports=router;