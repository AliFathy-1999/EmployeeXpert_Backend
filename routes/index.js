const express = require('express');

const employeeRoutes = require("./admin_employee");
const depRoutes = require("./admin_department");
const salaryRoutes = require ("./payroll");
const EmployeeSalaryRoutes = require ("./userSalary");

const router = express.Router();

router.use("/", employeeRoutes);
router.use("/dep", depRoutes);
router.use("/salary", salaryRoutes);
router.use("/employee/salary", EmployeeSalaryRoutes);

// router.use("/admin", adminRoute);

module.exports = router;

