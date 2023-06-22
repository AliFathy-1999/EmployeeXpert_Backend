const express = require('express');
const employeeRoutes = require("./emloyee");
const adminRoutes = require("./admin_employee");
const depRoutes = require("./admin_department");
const router = express.Router();

router.use("/admin/", adminRoutes);
router.use("/", employeeRoutes);
router.use("/dep", depRoutes);
// router.use("/admin", adminRoute);

module.exports = router;

