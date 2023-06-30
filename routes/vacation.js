const express = require('express');

const router = express.Router();
const {userAuth, adminAuth, Auth } = require('../middlewares/auth');

const { getAllVacations,applyForVacationByAdmin, getVacationWithemployeeId, getOneVacation, getOneVacationWithUserData, applyForVacation, modifyVacation, removeVacation } = require('../controllers/vacation');


router.get('/:id',Auth,getOneVacation);

router.post('/',userAuth,applyForVacation);

router.post('/admin',adminAuth,applyForVacationByAdmin);


router.get('/', adminAuth,getAllVacations);

router.get('/emp/:employeeId', adminAuth,getVacationWithemployeeId);


router.get('/:id/employee', Auth,getOneVacationWithUserData);


router.put('/:id',Auth,modifyVacation);

router.delete('/:id',userAuth, removeVacation);

module.exports = router;