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
 // Set the default workday start and end times
const DEFAULT_START_TIME = 9; // 9:00 AM
const DEFAULT_END_TIME = 22; // 6:00 PM

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

    const startTime = this.workdayStartTime || DEFAULT_START_TIME;
    const endTime = this.workdayEndTime || DEFAULT_END_TIME;
    const lateThreshold = new Date(newAttendance.checkIn.getTime());
    lateThreshold.setMinutes(lateThreshold.getMinutes() + 15); // 15-minute grace period
    if (newAttendance.checkIn > lateThreshold || newAttendance.checkIn.getHours() >= endTime) { 
      // Check if check-in time is after workday end time or after the grace period
      return false;
    }
    
    const startOfDay = new Date(newAttendance.checkIn.getTime());
    startOfDay.setHours(0, 0, 0, 0); // set the start of the day to midnight
    const endOfDay = new Date(newAttendance.checkIn.getTime());
    endOfDay.setHours(23, 59, 59, 999); // set the end of the day to 11:59 PM and 999 milliseconds
    
    const attendances = await Attendance.find({ employee: employee._id, checkIn: { $gte: startOfDay, $lt: endOfDay } });
    const lateArrivals = attendances.filter((a) => a.checkIn > lateThreshold).length;
    console.log(attendances)
    if (lateArrivals == 0) {
      // First late arrival - no deduction but issue a warning
      // Increment the late counter
      const employeeData = await Employee.findById(employee);
      
      if (attendances[0].lateCounter == 0) {
        console.log("hello");
  
        attendances[0].lateCounter = 1;
      } else {
        attendances[0].lateCounter += 1;
        console.log("hello2");
  
      }
      await attendances[0].save(); // Save the updated employeeData
      console.log("Warning: This is your first late arrival. No deductions will be calculated for now.");
    } else {
      // Calculate deductions based on the late counter
      let deduction;
      const employeeData = await Employee.findById(employee);
      if (attendances[0].lateCounter == 0) {
        attendances[0].lateCounter = 1;
      } else {
        
        switch (attendances[0].lateCounter) {
          case 1:
            // Second late arrival - deduct 10%
            deduction = 0.1;
            break;
          case 2:
            // Third late arrival - deduct 20%
            deduction = 0.2;
            break;
          case 3:
            // Fourth late arrival - deduct 25%
            deduction = 0.25;
            break;
          default:
            // Fifth or more late arrival - deduct 50%
            deduction = 0.5;
            break;
        }
        // Check if the deduction exceeds the daily salary
        const payrollId = attendances[0].payRate;
        const payroll = await Payroll.findById(payrollId);
        const dailySalary = payroll.payRate;
        if (deduction * dailySalary >= dailySalary) {
          deduction = 1; // Deduct the full day's salary
        }
      }
      const payRate = payroll.payRate;
      attendances[0].deduction = deduction;
      // Increment the late counter
      attendances[0].lateCounter += 1;
      await attendances[0].save();
    }
    res.json(attendances[0]);
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
