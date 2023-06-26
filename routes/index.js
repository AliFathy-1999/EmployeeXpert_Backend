const express = require('express');
const router = express.Router();
const employeeRoutes = require("./employee");
const depRoutes = require("./department");
const commRoute = require("./communications")


router.use("/", employeeRoutes);
router.use("/dep", depRoutes);
router.use("/communications",commRoute)
// router.use("/admin", adminRoute);

module.exports = router;

