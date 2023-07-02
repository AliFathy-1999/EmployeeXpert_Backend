const express = require('express');

const employeeRoutes = require("./admin_employee");
const depRoutes = require("./admin_department");
// const attendanceRoutes = require("./attendance");
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

router.use("/", employeeRoutes);
router.use("/dep", depRoutes);
// router.use("/attendance",attendanceRoutes);
// router.use("/admin", adminRoute);

module.exports = router;

