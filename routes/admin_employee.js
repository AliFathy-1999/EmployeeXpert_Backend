const express = require('express');
const { asycnWrapper }  = require('../lib/index');

const { employeeController } = require('../controllers/index');
const { usersValidator } = require('../Validations');
const {adminAuth} = require('../middlewares/auth');
// const { validate } = require('../middlewares/validation');



const router = express.Router();

// Add Employee
router.post('/', adminAuth, async (req, res, next) => {
    const { body: {
      firstName, lastName, userName, email, password, nationalId,
      role,hireDate,position,depId,salary,phoneNumber,jobType,gender,
      address:{street,city},
      academicQualifications:{degree,institution,year},pImage, 
    }} = req;
    const user = employeeController.create({
      firstName, lastName, userName, email, password, nationalId,
      role,hireDate,position,depId,salary,phoneNumber,jobType,gender,
      address:{street,city},academicQualifications:{degree,institution,year},pImage, 
    });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    res.status(201).json({ status:'success', data });
  });

// Sign in 
router.post('/signin', async (req, res) => {
  try {
    const { userName, password } = req.body;    
    const data = await employeeController.signIn({ userName, password });    
    res.status(200).json({status:'success', data })
  } catch (err) {
    next(err);
  }
});


module.exports = router;

