const express = require('express');
const { asycnWrapper, AppError} = require('../lib/index');
const holidayController = require('../controllers/holiday');
const {adminAuth, Auth} = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { holidayValidator } = require('../Validations/index');


const router = express.Router();

router.post('/' ,validate(holidayValidator.holiday),adminAuth, async(req,res,next)=>{
    const { body: {
        holidayName , holidayDate , noOfDays
      }} = req;
    const createHoliday = holidayController.creteHoliday({
        holidayName , holidayDate , noOfDays
    })
    const [err , data] = await asycnWrapper(createHoliday)
    if (err) return next(err)
    res.status(201).json({ status:'success', data });
})

router.get('/all' , Auth , async(req,res,next)=>{
    const {page,limit} = req.query;
    const getAllHoliday = holidayController.getAllHolidays(page , limit);
    const [err , data] = await asycnWrapper(getAllHoliday);
    if(err) return next(err)
    res.status(200).json({ status:'success', data });
})

router.get('/:id' , Auth , async(req,res,next)=>{
    const {id} = req.params;
    const getOneHoliday = holidayController.getOneHoliday(id);
    const [err , data] = await asycnWrapper(getOneHoliday);
    if(err) return next(err)
    if (!data) return next(new AppError (`No Holiday with ID ${id}`, 400));

    res.status(200).json({ status:'success', data });
})

router.put('/:id',adminAuth,validate(holidayValidator.holiday),holidayController.updateHoliday);

router.delete('/:id',adminAuth,holidayController.deleteHoliday);


module.exports = router;