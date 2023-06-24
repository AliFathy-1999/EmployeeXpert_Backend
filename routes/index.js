const express = require('express');
const router = express.Router();

const employeeRoutes = require("./emloyee");
const adminRoutes = require("./admin_employee");
const depRoutes = require("./admin_department");
const employeeVacationsRoutes = require("./vacation");

router.use("/admin/", adminRoutes);
router.use("/", employeeRoutes);
router.use("/dep", depRoutes);
router.use("/vacations",employeeVacationsRoutes);
// router.use("/admin", adminRoute);



module.exports = router;

