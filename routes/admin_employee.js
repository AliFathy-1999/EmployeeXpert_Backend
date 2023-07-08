const express = require('express');
const { asycnWrapper, AppError } = require('../lib/index');
const { extractPublicId } = require('cloudinary-build-url')

const { employeeController } = require('../controllers/index');
const { employeesValidator } = require('../Validations/index');
const { validate } = require('../middlewares/validation');
const {adminAuth} = require('../middlewares/auth');
const Department = require('../DB/models/department')
const Payroll = require('../DB/models/payroll')
const router = express.Router();
const {upload,removeImage} = require("../middlewares/imageMiddleware");
const Employee = require('../DB/models/employee');

router.use(adminAuth)

// Add Employee

router.post('/', upload.single('pImage'),validate(employeesValidator.signUp), async (req, res, next) => {
  const pImage = req.file? req.file.path : undefined 
  const { body: {
      firstName, lastName, userName, email, password, nationalId,
      role, hireDate, position, depId, salary, phoneNumber, jobType, DOB, gender, address,
      academicQualifications, 
    }} = req;
    // Detect If Entered Department is existed or not
    const department = await Department.findOne({_id : depId}).exec();
    if (!department) {
      return next(new AppError (`No Department with ID ${depId}`, 400));
    }
    const user = employeeController.createEmployee({
      firstName, lastName, userName, email, password, nationalId,
      role, hireDate, position, depId, salary, phoneNumber, jobType, DOB, gender,
      address, academicQualifications, pImage, 
    });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    res.status(201).json({ status : 'success',data });
  });

  // Get All Employee (USER or ADMIN)

  router.get('/', async (req, res, next) => {
    const { role, page, limit } = req.query
    const user = employeeController.getEmployees(role, page, limit);
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err); 
    res.status(201).json({ status : 'success', data });
  })
  
   // Get All Employee (USER or ADMIN)

   router.get('/getselected', async (req, res, next) => {
    const user = employeeController.getSelectedEmployees();
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err); 
    res.status(201).json({ status : 'success', data });
  })

  // Admin update employee data

  router.put('/:id', upload.single("pImage"),validate(employeesValidator.signUp), validate(employeesValidator.checkvalidID), async (req, res, next) => {
    const { params : { id }} = req;
    const {  
      firstName, lastName, nationalId,
      hireDate, position, depId, salary, phoneNumber, jobType, gender, 
      address, academicQualifications,  
    } = req.body;
    const pImage = req.file? req.file.path : undefined 
    if(depId){
      const department = await Department.findOne({_id : depId});
      if (!department) 
        return next(new AppError (`No Department with ID ${depId}`, 400));
    }
    const user = employeeController.updateEmployee(id, {
      firstName, lastName, nationalId,
      hireDate, position, depId, salary, phoneNumber, jobType, gender,
      address, academicQualifications, pImage
    });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    if (!data) return next(new AppError (`No Employee with ID ${id}`, 400));
    res.status(201).json({ status : 'success', data });
  });

// Admin delete employee (USER)

  router.delete('/:id', validate(employeesValidator.checkvalidID), async (req, res, next) => {
    const { params : { id }} = req;
    const employee = await Employee.findOne({_id:id});
    if(!employee)
      return next(new AppError (`No Employee with ID ${id}`, 400));
    if (employee?.role === 'ADMIN') 
        return next(new AppError ('You cannot delete any Admin',401));
    const imageUrl = employee.pImage; 
    const publicId = extractPublicId(imageUrl);
    removeImage(publicId)
    const user = employeeController.deleteEmployee(id);
    await Payroll.deleteOne({ employeeId : id });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    if (!data) return next(new AppError (`No Employee with ID ${id}`, 400));
    res.status(201).json({ status : 'success' });
  });


// Search on Employee with first name

router.get('/search/', async (req, res, next) => {
  const { searchText, page, limit } = req.query
  const user = employeeController.searchOnEmployee(searchText, page, limit);
  const [err, data] = await asycnWrapper(user);
  if (err) return next(err); 
  res.status(201).json({ status : 'success', data });
})

module.exports = router;

