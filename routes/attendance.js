const express = require('express');
const { attendanceController }  = require('../controllers/index');

const { adminAuth, Auth } = require('../middlewares/auth');

const router = express.Router();

// Create a new attendance record
router.post('/', adminAuth, attendanceController.create);

// Get a specific attendance record by ID
router.get('/:id', adminAuth, attendanceController.getAttendanceById);

// Update a specific attendance record by ID
router.put('/:id', adminAuth, attendanceController.updateAttendanceById);

// Delete a specific attendance record by ID
router.delete('/:id', adminAuth, attendanceController.deleteAttendanceById);

// Check-in route
router.post('/checkin/', adminAuth,  attendanceController.checkIn);

// Check-out route
router.post('/checkout/', adminAuth, attendanceController.checkOut);

// get all attendances for employee 
router.get('/all/', attendanceController.getAllAttendancesOfEmployee);

module.exports = router;