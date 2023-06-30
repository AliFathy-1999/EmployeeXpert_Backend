const express = require('express');

const router = express.Router();

const { getAllVacations, getVacationWithemployeeId, getOneVacation, getOneVacationWithUserData, applyForVacation, modifyVacation, removeVacation } = require('../controllers/vacation');


router.get('/:id', getOneVacation);

router.post('/', applyForVacation);

router.get('/', getAllVacations);

router.get('/emp/:employeeId', getVacationWithemployeeId);


router.get('/:id/employee', getOneVacationWithUserData);


router.put('/:id', modifyVacation);

router.delete('/:id', removeVacation);

module.exports = router;