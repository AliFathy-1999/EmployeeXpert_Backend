const express = require('express');
const { asycnWrapper }  = require('../lib/index');

const { employeeController } = require('../controllers/index');
const { usersValidator } = require('../Validations');
// const { validate } = require('../middlewares/validation');


const router = express.Router();

router.post('/register', async (req, res, next) => {
    const { body: {
      firstName, lastName, userName, email, password, nationalId,
      role,hireDate,position,dep_id,salary,phoneNumber,
      address:{street,city},
      pImage, 
    }} = req;
    const user = employeeController.create({
      firstName, lastName, userName, email, password, nationalId,
      role,hireDate,position,dep_id,salary,phoneNumber,
      address:{street,city},
      pImage, 
    });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    res.status(201).json({ status:'success', data });
  });


module.exports = router;

