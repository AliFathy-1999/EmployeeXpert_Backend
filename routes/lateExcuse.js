const express = require('express');
const { asycnWrapper , AppError}  = require('../lib/index');
const {userAuth} = require('../middlewares/auth');
const excuseController = require('../controllers/lateExcuse')

const router = express.Router();

router.post('/', userAuth , async (req,res,next)=>{
    const employeeId = req.user._id;
    console.log(req.user._id)
    console.log(employeeId)
    const { reason,
        from,
        to,
        typeOfExcuse } = req.body;
        
    console.log(req.body.reason)
    console.log(req.body.from)
    console.log(req.body.to)
    console.log(req.body.typeOfExcuse)

    const createExcuse = excuseController.createExcuse(employeeId,{
        reason, 
        from, 
        to, 
        typeOfExcuse
    });
    const [err,data] = await asycnWrapper(createExcuse)
    if(err) return next(err);
    res.status(201).json({status:'success' , data});
})


module.exports=router


