const express = require('express');
const {userAuth, adminAuth, Auth } = require('../middlewares/auth');
const { asycnWrapper} = require('../lib/index');
const vacationReportVacation= require('../controllers/vacationReport');
const router = express.Router();

// router.get('/all',adminAuth,getVacationReport);
// // router.post('/add',Auth,addingDataToReport);
// router.get('/one',userAuth,getEmployeeVacationReport);

router.get('/all', adminAuth, async (req, res, next) => {
    const { page, limit } = req.query
    const getVacationReport = vacationReportVacation.getAllEmployeeVacationReport(page, limit);
    const [err, data] = await asycnWrapper(getVacationReport);
    if (err) return next(err);
    res.status(200).json({ status : 'success', data });
        });

module.exports=router;