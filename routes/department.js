const express = require('express');
const { asycnWrapper, AppError } = require('../lib/index');

const { departmentController } = require('../controllers/index');
const {Auth} = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const router = express.Router();
router.use(Auth)

// Get Department Details

router.get('/:id', async (req, res, next) => {
  const { params: { id }} = req;
  const department = departmentController.getDepartmentDatials(id);
  const [err, data] = await asycnWrapper(department);
  if (err) return next(err);
  if (!data) return next(new AppError (`No Department with ID ${id}`, 400));
  res.status(201).json({ status : 'success', data });
});

// Get Department with Employees

router.get('/emp/:id', async (req, res, next) => {
  const { params: { id } , query:{ page, limit }} = req;
  const departmentEmps = departmentController.fetchDepEmployees(id, page, limit);
  const [err, data] = await asycnWrapper(departmentEmps);
  if (err) return next(err);
  if (!data[0]) return next(new AppError (`No Department with ID ${id}`, 400));
  res.status(201).json({ status : 'success', data });
});


module.exports = router;

