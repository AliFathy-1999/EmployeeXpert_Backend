const jwt = require('jsonwebtoken');
const Attendance = require('../DB/models/attendance');
const Employee = require('../DB/models/employee');

const { AppError } = require('../lib/index');


const create = async (req, res, next) => {
  try {
    const { employeeID, checkIn, checkOut, deduction } = req.body;

    // check that the employee ID is valid
    const employee = await Employee.findById(employeeID);
    if (!employee) {
      throw new AppError('Invalid employee ID', 400);
    }

    // create a new attendance record
    const attendance = await Attendance.create({
      employee: employee._id,
      checkIn,
      checkOut,
      deduction
    });

    res.status(201).json({
      status: 'success',
      data: {
        attendance
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        attendance
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        attendance
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteAttendanceById = async (req, res, next) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
  };

 // Check-in route
 const checkIn = async (req, res, next) => {
  try {
    // Check if the employee ID is valid
    const employee = await Employee.findById(req.body.employee);
    if (!employee) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    // Check if the employee has already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to midnight
    const attendance = await Attendance.findOne({ 
      employee: employee._id,
       checkIn: { $gte: today } });
    if (attendance) {
      return res.status(400).json({ 
        message: 'Employee has already checked in today' });
    }

    // Create a new attendance record
    const newAttendance = new Attendance({
      employee: employee._id,
      checkIn: new Date()
    });
    try {
      await newAttendance.validate();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    await newAttendance.save();

    res.json(newAttendance);
    // res.status(200).json({ message: 'Employee checked in successfully' })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check-out route
const checkOut = async (req, res, next) => {
  try {
    const employee = req.body.employee;
    console.log('Employee ID:', employee);
    
    const attendance = await Attendance.findOne({ employee: employee }).sort({ createdAt: -1 });
    console.log('Attendance:', attendance);
    
    if (!attendance) {
      return res.status(400).json({ message: 'Employee has not checked in today' });
    }

    // Check if the employee has already checked out
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Employee has already checked out' });
    }

    // Check if the employee has checked in
    if (!attendance.checkIn) {
      return res.status(400).json({ message: 'Employee has not checked in yet' });
    }

    // Update the Attendance document with the current time as the check-out time
    attendance.checkOut = new Date();
    await attendance.save();

    res.json(attendance);
    // res.status(200).json({ message: 'Employee checked out successfully' }) 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  

module.exports = {
  create,
  getAttendanceById,
  updateAttendanceById,
  deleteAttendanceById,
  checkIn,
  checkOut
};
