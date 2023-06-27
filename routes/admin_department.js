const express = require('express');
const { asycnWrapper, AppError } = require('../lib/index');

const { departmentController } = require('../controllers/index');
const { departmentValidator } = require('../Validations');
const {adminAuth} = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Employee = require('../DB/models/employee');
const router = express.Router();
router.use(adminAuth)

// Add Department 

router.post('/', validate(departmentValidator.addDepartment), async (req, res, next) => {
    const { body: { name, description, managerId }} = req;
    const manager = await Employee.findOne({_id : managerId});
    if (!manager) 
      return next(new AppError (`No Manager with ID ${managerId}`, 400));
    const department = departmentController.createDepartment({ name, description, managerId });
    const [err, data] = await asycnWrapper(department);
    if (err) return next(err);
    res.status(201).json({ status : 'success', data });
});

// Update department 

router.patch('/:id', validate(departmentValidator.addDepartment), async (req, res, next) => {
  const { body: { name, description, managerId }, params: { id }} = req;
  const manager = await Employee.findOne({_id : managerId});
  if (!manager) 
    return next(new AppError (`No Manager with ID ${managerId}`, 400));
  const department = departmentController.updateDepartment(id, { name, description, managerId });
  const [err, data] = await asycnWrapper(department);
  if (err) return next(err);
  if (!data) return next(new AppError (`No Department with ID ${id}`, 400));
  res.status(201).json({ status : 'success', data });
});

// Get all Departments

router.get('/', async (req, res, next) => {
  const { page, limit } = req.query
  const department = departmentController.getDepartments(page, limit);
  const [err, data] = await asycnWrapper(department);
  if (err) return next(err);
  res.status(201).json({ status : 'success', data });
});

// Delete Department

router.delete('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  const department = departmentController.deleteDepartment(id);
  const [err, data] = await asycnWrapper(department);
  if (err) return next(err);
  if (!data) return next(new AppError (`No Department with ID ${id}`, 400));
  res.status(201).json({ status : 'success' });
});

module.exports = router;

