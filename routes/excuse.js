const express = require('express');
const { asycnWrapper , AppError}  = require('../lib/index');
const {userAuth} = require('../middlewares/auth');
const excuseController = require('../controllers/excuse')

const router = express.Router();

router.post('/', userAuth , async (req,res,next)=>{
    const employeeId = req.user._id;
    const { reason,from,to,typeOfExcuse } = req.body;

    const createExcuse = excuseController.createExcuse({
        employeeId,
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

