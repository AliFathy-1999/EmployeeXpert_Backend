const express = require('express');
const { asycnWrapper } = require('../lib/index');

const { employeeController } = require('../controllers/index');
const { userAuth, Auth} = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { signIn } = require('../Validations/employee');


const router = express.Router();

// Sign in 

router.post('/signin', validate(signIn), async (req, res) => {
  try {
    const { userName, password } = req.body;    
    const data = await employeeController.signIn({ userName, password });    
    res.status(200).json({status : 'success', data })
  } catch (err) {
    next(err);
  }
});
router.get('/user', Auth, validate(signIn), async (req, res) => {
  try {
    const myID = req.user._id   
    const data = await employeeController.getMe(myID);    
    res.status(200).json({status : 'success', data })
  } catch (err) {
    next(err);
  }
});

module.exports = router;

