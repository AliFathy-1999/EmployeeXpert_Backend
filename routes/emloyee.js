const express = require('express');
const { asycnWrapper, AppError } = require('../lib/index');

const { employeeController } = require('../controllers/index');
const { userAuth, Auth} = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { signIn } = require('../Validations/employee');
const { employeesValidator } = require('../Validations/index');

const router = express.Router();

// Sign in 

router.post('/signin', validate(signIn), async (req, res, next) => {
  try {
    const { userName, password } = req.body;    
    const data = await employeeController.signIn({ userName, password });    
    res.status(200).json({status : 'success', data })
  } catch (err) {
    next(err);
  }
});

// Get My Data

router.get('/user', Auth, validate(signIn), async (req, res) => {
  try {
    const myID = req.user._id   
    const data = await employeeController.getMe(myID);    
    res.status(200).json({status : 'success', data })
  } catch (err) {
    next(err);
  }
});

// Get specified employee (USER or Admin)

router.get('/:id', Auth, validate(employeesValidator.checkvalidID), async (req, res, next) => {
  const { id } = req.params;
  let user;
  
  // Get specified employee if your are an admin or logged in user

  if (req.user.role === 'ADMIN' || req.user._id.toString() == id)
    user = employeeController.employeeDetails(id);
  else
    return next(new AppError('Access denied. You do not have the privilege to perform this action.', 403));
  const [err, data] = await asycnWrapper(user);
  if (err) return next(err); 
  if (!data) return next(new AppError (`No Employee with ID ${id}`, 400));
  res.status(201).json({ status : 'success', data });
})
module.exports = router;

