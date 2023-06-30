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
const attendanceRoutes = require('./attendance'); // Import the attendance routes

router.use('/', employeeRoutes);
router.use('/communications', commRoute)
router.use('/admin/emp', adminEmpRoutes);
router.use('/admin/dep', adminDepRoutes);
router.use('/dep', depRoutes);
router.use('/vacations', employeeVacationsRoutes);
router.use('/salary', salaryRoutes);
router.use('/employee/salary', EmployeeSalaryRoutes);
router.use('/attendance', attendanceRoutes); // Use the attendance routes

module.exports = router;

