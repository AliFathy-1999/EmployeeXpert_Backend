const express = require('express');
const { asycnWrapper } = require('../lib/index');

const { dep, departmentController } = require('../controllers/index');
const { usersValidator } = require('../Validations');
const {adminAuth} = require('../middlewares/auth');

const router = express.Router();
router.use(adminAuth)

router.post('/', async (req, res, next) => {
    const { body: { name, description }} = req;
    const department = departmentController.createDepartment({ name, description });
    const [err, data] = await asycnWrapper(department);
    if (err) return next(err);
    res.status(201).json({ status : 'success', data });
});

router.get('/', async (req, res, next) => {
  const { page, limit } = req.query
  const department = departmentController.getDepartments(page, limit);
  const [err, data] = await asycnWrapper(department);
  if (err) return next(err);
  res.status(201).json({ status : 'success', data });
});

module.exports = router;

