const express = require('express');
const { asycnWrapper , AppError}  = require('../lib/index');
const {userAuth} = require('../middlewares/auth');
const excuseController = require('../controllers/lateExcuse')

const router = express.Router();

router.post('/', userAuth , async (req,res,next)=>{
    const employeeId = req.user._id;
    console.log(req.user._id)
    console.log(employeeId)
    const { reason, from, to } = req.body;
    console.log(req.body.reason)
    const createExcuse = excuseController.createExcuse(req.user._id,{
        reason,from,to
    });
    const [err,data] = await asycnWrapper(createExcuse)
    if(err) return next(err);
    res.status(201).json({status:'success' , data});
})


module.exports=router


