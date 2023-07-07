const express = require('express');
const {userAuth, adminAuth, Auth } = require('../middlewares/auth');
const {getAllCasualVacations,getCasualVacationWithemployeeId,applyForCasualVacation } = require('../controllers/casualVacations');
const { casualVacationValidator } = require('../Validations/index');
const { validate } = require('../middlewares/validation');
const router = express.Router();

router.get('/all',adminAuth,getAllCasualVacations);

router.get('/myCasualVacations',userAuth,getCasualVacationWithemployeeId);

router.post('/apply',validate(casualVacationValidator),userAuth,applyForCasualVacation)


module.exports = router;