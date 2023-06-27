const express = require('express');
const router = express.Router();
const employeeRoutes = require('./emloyee');
const depRoutes = require('./department');
const commRoute = require('./communications')
const adminEmpRoutes = require('./admin_employee');
const adminDepRoutes = require('./admin_department');
const employeeVacationsRoutes = require('./vacation');
const salaryRoutes = require ('./payroll');
const EmployeeSalaryRoutes = require ('./userSalary');

router.use('/dep', depRoutes);
router.use('/communications', commRoute)
router.use('/', employeeRoutes);
router.use('/admin/emp/', adminEmpRoutes);
router.use('/admin/dep/', adminDepRoutes);
router.use('/dep/', depRoutes);
router.use('/vacations', employeeVacationsRoutes);
router.use('/salary', salaryRoutes);
router.use('/employee/salary', EmployeeSalaryRoutes);

module.exports = router;

