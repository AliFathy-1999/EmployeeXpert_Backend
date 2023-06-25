const express = require('express');
const router = express.Router();

const employeeRoutes = require('./emloyee');
const adminEmpRoutes = require('./admin_employee');
const adminDepRoutes = require('./admin_department');
const employeeVacationsRoutes = require('./vacation');
const salaryRoutes = require ('./payroll');
const EmployeeSalaryRoutes = require ('./userSalary');

router.use('/', employeeRoutes);
router.use('/admin/emp/', adminEmpRoutes);
router.use('/admin/dep/', adminDepRoutes);
router.use('/vacations', employeeVacationsRoutes);
router.use('/salary', salaryRoutes);
router.use('/employee/salary', EmployeeSalaryRoutes);

// router.use("/admin", adminRoute);


module.exports = router;

