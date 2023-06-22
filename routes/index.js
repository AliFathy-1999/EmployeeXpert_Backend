const express = require('express');

const employeeRoutes = require("./admin_employee");
const depRoutes = require("./admin_department");
const router = express.Router();

router.use("/", employeeRoutes);
router.use("/dep", depRoutes);
// router.use("/admin", adminRoute);

module.exports = router;

