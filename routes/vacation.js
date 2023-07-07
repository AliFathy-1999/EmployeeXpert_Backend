const express = require('express');
const {userAuth, adminAuth, Auth } = require('../middlewares/auth');
const { getAllVacations, getVacationWithemployeeId, getOneVacation, getOneVacationWithUserData, applyForVacation, modifyVacation, removeVacation ,applyForVacationByAdmin,modifyVacationByUser} = require('../controllers/vacation');
const { vacationValidator } = require('../Validations/index');
const { validate } = require('../middlewares/validation');
const router = express.Router();

router.get('/all',adminAuth,getAllVacations);

router.get('/:id',Auth,getOneVacation);

router.post('/',userAuth,validate(vacationValidator.vacation),applyForVacation);

router.post('/admin',adminAuth,applyForVacationByAdmin);



router.get('/emp/all', userAuth,getVacationWithemployeeId);


router.get('/:id/employee', Auth,getOneVacationWithUserData);


// router.put('/admin/:id',adminAuth,modifyVacation);
router.put('/:id',userAuth,validate(vacationValidator.vacation),modifyVacationByUser);

router.delete('/:id',userAuth, removeVacation);

module.exports = router;