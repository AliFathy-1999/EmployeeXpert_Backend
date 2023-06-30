const express = require('express');
const {userAuth, adminAuth, Auth } = require('../middlewares/auth');
const { getAllVacations, getVacationWithemployeeId, getOneVacation, getOneVacationWithUserData, applyForVacation, modifyVacation, removeVacation ,applyForVacationByAdmin} = require('../controllers/vacation');
const { vacationValidator } = require('../Validations/index');
const { validate } = require('../middlewares/validation');
const router = express.Router();

router.get('/all',adminAuth,getAllVacations);

router.get('/:id',Auth,getOneVacation);

router.post('/',userAuth,validate(vacationValidator.vacation),applyForVacation);

router.post('/admin',adminAuth,applyForVacationByAdmin);



router.get('/emp/:employeeId', adminAuth,getVacationWithemployeeId);


router.get('/:id/employee', Auth,getOneVacationWithUserData);


router.put('/:id',Auth,validate(vacationValidator.vacationSchema),modifyVacation);

router.delete('/:id',userAuth, removeVacation);

module.exports = router;