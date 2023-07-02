const express = require('express');
const {userAuth, adminAuth, Auth } = require('../middlewares/auth');
const {getVacationReport,addingDataToReport,getEmployeeVacationReport } = require('../controllers/vacationReport');
const router = express.Router();

router.get('/all',adminAuth,getVacationReport);
router.post('/add',Auth,addingDataToReport);
router.get('/one',userAuth,getEmployeeVacationReport);


module.exports=router;