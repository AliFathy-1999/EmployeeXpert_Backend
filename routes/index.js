const express = require('express');

const employeeRoutes = require("./admin_employee");
const depRoutes = require("./admin_department");
// const attendanceRoutes = require("./attendance");
const router = express.Router();

router.use("/", employeeRoutes);
router.use("/dep", depRoutes);
// router.use("/attendance",attendanceRoutes);
// router.use("/admin", adminRoute);

module.exports = router;

