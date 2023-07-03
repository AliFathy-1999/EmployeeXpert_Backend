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
const lateExcuseRoutes = require ('./excuse');
const vacationReportRoutes = require ('./vacationReport');
const holidayRoutes = require('./holiday');
const leaveReportsVacation = require ('./leaveReport')

router.use('/admin-emp', adminEmpRoutes);
router.use('/admin-dep', adminDepRoutes);
router.use('/', employeeRoutes);
router.use('/communications', commRoute)
router.use('/dep', depRoutes);
router.use('/vacations', employeeVacationsRoutes);
router.use('/salary', salaryRoutes);
router.use('/employee/salary', EmployeeSalaryRoutes);
router.use('/attendance', attendanceRoutes); // Use the attendance routes
router.use('/excuse' , lateExcuseRoutes);
router.use('/vReport' , vacationReportRoutes);
router.use('/holiday' , holidayRoutes);
router.use('/lReport' , leaveReportsVacation)


module.exports = router;
