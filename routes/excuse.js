const express = require('express');
const { asycnWrapper, AppError} = require('../lib/index');
const {userAuth} = require('../middlewares/auth');
const excuseController = require('../controllers/excuse')

const router = express.Router();

router.post('/', userAuth, async (req, res, next)=>{
    const employeeId = req.user._id;
    const { reason, from, to, typeOfExcuse } = req.body;

    const createExcuse = excuseController.createExcuse({
        employeeId,
        reason, 
        from, 
        to, 
        typeOfExcuse
    });
    const [err, data] = await asycnWrapper(createExcuse)
    if(err) return next(err);
    res.status(201).json({status : 'success', data});
})

// router.get('/all', excuseController.getAllExcuses)

router.delete('/:id', userAuth, async(req, res, next)=>{
    const excuseId = req.params.id;
    const deleteExecuse = excuseController.deleteExecuse(excuseId);
    const [err, data] = await asycnWrapper(deleteExecuse);
    if(err) return next(err);
    if (!data) return next(new AppError (`No Excuse with ID ${excuseId}`, 400));
    res.status(200).json({ status : 'success' });
    
})


router.get('/all', async (req, res, next) => {
    const getAllExcuses = excuseController.getAllExcuses;
    const [err, data] = await asycnWrapper(getAllExcuses(req, res));
  
    if (err) return next(err);
    res.status(200).json({ status : 'success', data });
  });
module.exports = router


