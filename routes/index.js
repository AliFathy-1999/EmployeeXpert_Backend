const express = require('express');
const router = express.Router();

const employeeRoutes = require('./emloyee');
const adminEmpRoutes = require('./admin_employee');
const depRoutes = require('./admin_department');
const employeeVacationsRoutes = require('./vacation');
const salaryRoutes = require ('./payroll');
const EmployeeSalaryRoutes = require ('./userSalary');


router.use('/admin/', adminEmpRoutes);
router.use('/', employeeRoutes);
router.use('/dep/', depRoutes);
router.use('/vacations', employeeVacationsRoutes);
router.use('/salary', salaryRoutes);
router.use('/employee/salary', EmployeeSalaryRoutes);

// router.use("/admin", adminRoute);


module.exports = router;

