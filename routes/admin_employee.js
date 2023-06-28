const express = require('express');
const { asycnWrapper, AppError } = require('../lib/index');

const { employeeController } = require('../controllers/index');
const { employeesValidator } = require('../Validations/index');
const { validate } = require('../middlewares/validation');
const {adminAuth} = require('../middlewares/auth');
const Department = require('../DB/models/department')
const Payroll = require('../DB/models/payroll')
const router = express.Router();

router.use(adminAuth)

// Add Employee

router.post('/', validate(employeesValidator.signUp), async (req, res, next) => {
    const { body: {
      firstName, lastName, userName, email, password, nationalId,
      role, hireDate, position, depId, salary, phoneNumber, jobType, DOB, gender, address,
      academicQualifications:{college, degree, institution, year}, pImage, 
    }} = req;

    // Detect If Entered Department is existed or not

    const department = await Department.findOne({_id : depId});
    if (!department) 
      return next(new AppError (`No Department with ID ${depId}`, 400));

    const user = employeeController.createEmployee({
      firstName, lastName, userName, email, password, nationalId,
      role, hireDate, position, depId, salary, phoneNumber, jobType, DOB, gender,
      address, academicQualifications : {college, degree, institution, year}, pImage, 
    });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    res.status(201).json({ status : 'success' });
  });

  // Admin update employee data

  router.put('/:id', validate(employeesValidator.signUp), validate(employeesValidator.checkvalidID), async (req, res, next) => {
    const { params : { id }} = req;
    const {  
      firstName, lastName, nationalId,
      role, hireDate, position, depId, salary, phoneNumber, jobType, gender,
      address, academicQualifications, pImage, 
    } = req.body;
    if(depId){
      const department = await Department.findOne({_id : depId});
      if (!department) 
        return next(new AppError (`No Department with ID ${depId}`, 400));
    }
    const user = employeeController.updateEmployee(id, {
      firstName, lastName, nationalId,
      role, hireDate, position, depId, salary, phoneNumber, jobType, gender,
      address, academicQualifications, pImage
    });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    if (!data) return next(new AppError (`No Employee with ID ${id}`, 400));
    res.status(201).json({ status : 'success', data });
  });


  router.patch('/acad/:id', validate(employeesValidator.checkvalidID), async (req, res, next) => {
    const { params : { id }} = req;
    const { college, degree, institution, year} = req.body;
    console.log(req.body);
    const user = employeeController.updateAcademicQual(id, {college, degree, institution, year});
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    if (!data) return next(new AppError (`No Employee with ID ${id}`, 400));
    res.status(201).json({ status : 'success', data });
});

// Admin delete employee (USER)

  router.delete('/:id', validate(employeesValidator.checkvalidID), async (req, res, next) => {
    const { params : { id }} = req;
    const user = employeeController.deleteEmployee(id);
    await Payroll.deleteOne({ employeeId : id });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    if (!data) return next(new AppError (`No Employee with ID ${id}`, 400));
    res.status(201).json({ status : 'success' });
  });

  // Get All Employee (USER or ADMIN)

router.get('/', async (req, res, next) => {
  const { role, page, limit } = req.query
  const user = employeeController.getEmployees(role, page, limit);
  const [err, data] = await asycnWrapper(user);
  if (err) return next(err); 
  res.status(201).json({ status : 'success', data });
})

// Get specified employee (USER or Admin)

router.get('/:id', validate(employeesValidator.checkvalidID), async (req, res, next) => {
  const { id } = req.params;
  const user = employeeController.employeeDetails(id);
  const [err, data] = await asycnWrapper(user);
  if (err) return next(err); 
  if (!data) return next(new AppError (`No Employee with ID ${id}`, 400));
  res.status(201).json({ status : 'success', data });
})
module.exports = router;

