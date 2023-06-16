const express = require('express');

const employeeRoutes = require("./employee");
const depRoutes = require("./department");
const attendanceRoutes = require("./attendance");
const router = express.Router();

router.use("/", employeeRoutes);
router.use("/dep", depRoutes);
router.use("/attendance",attendanceRoutes);
// router.use("/admin", adminRoute);

module.exports = router;

