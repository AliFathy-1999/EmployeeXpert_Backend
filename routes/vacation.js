const express = require('express');

const router = express.Router();

const { getAllVacations,getOneVacationWithemployeeId, getOneVacation , getOneVacationWithUserData, applyForVacation , modifyVacation , removeVacation } = require('../controllers/vacation');

router.post('/',applyForVacation);

router.get('/',getAllVacations);

router.get('/:employeeId',getOneVacationWithemployeeId);


router.get('/:id',getOneVacation);

router.get('/:id/employee',getOneVacationWithUserData);



router.put('/:id',modifyVacation);

router.delete('/:id',removeVacation);

module.exports = router;