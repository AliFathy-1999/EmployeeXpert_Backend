const express = require('express');

const employeeRoutes = require("./employee");
const depRoutes = require("./department");
const router = express.Router();

router.use("/", employeeRoutes);
router.use("/dep", depRoutes);
// router.use("/admin", adminRoute);

module.exports = router;

