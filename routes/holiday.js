const express = require('express');
const { asycnWrapper, AppError} = require('../lib/index');
const holidayController = require('../controllers/holiday');
const {adminAuth} = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { holidayValidator } = require('../Validations/index');


const router = express.Router();

router.post('/' , adminAuth, validate(holidayValidator.holiday), async(req,res,next)=>{
    const { holidayName , holidayDate , noOfDays } = req.body
    const createHoliday = holidayController.creteHoliday({
        holidayName , holidayDate , noOfDays
    })
    const [err , data] = await asycnWrapper(createHoliday)
    if (err) return next(err)
    res.status(201).json({ status:'success', data });
})

module.exports = router;