const express = require('express');
const { asycnWrapper }  = require('../lib/index');

const { dep, departmentController } = require('../controllers/index');
const { usersValidator } = require('../Validations');
// const { validate } = require('../middlewares/validation');


const router = express.Router();

router.post('/', async (req, res, next) => {
    const { body: { name, description }} = req;
    const department = departmentController.create({ name, description });
    const [err, data] = await asycnWrapper(department);
    if (err) return next(err);
    res.status(201).json({ status:'success', data });
  });


module.exports = router;

