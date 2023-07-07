/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const Attendance = require('../DB/models/attendance');
const Employee = require('../DB/models/employee');
const Vacation = require('../DB/models/vacation');
const Payroll = require('../DB/models/payroll');

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
      employee : employee._id,
      checkIn,
      checkOut,
      deduction,
    });

    res.status(201).json({
      status : 'success',
      data :   {
        attendance,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    res.status(200).json({
      status : 'success',
      data :   {
        attendance,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new :           true,
        runValidators : true,
      }
    );
    res.status(200).json({
      status : 'success',
      data :   {
        attendance,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAttendanceById = async (req, res, next) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status : 'success',
      data :   null,
    });
  } catch (error) {
    next(error);
  }
};

const getAllAttendancesOfEmployee = async (req, res, next) => { 
  try {
        let token;

        // const token = req.cookies.jwt;

        if (
            req.headers.authorization
              && req.headers.authorization.startsWith('bearer')
        ) {
            // eslint-disable-next-line prefer-destructuring
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
          console.log('no token')
            return false;
        }
        const payload = jwt.verify(token, process.env.TOKEN_KEY);
       
    const page = parseInt(req.query.page) || 1; // Current page (default: 1)
    const limit = parseInt(req.query.limit) || 10; // Number of documents per page (default: 10)

    const skip = (page - 1) * limit; // Number of documents to skip

    const attendances = await Attendance.find({ employee : payload.userId})

    const totalPages = Math.ceil(attendances.length / limit);

    res.status(200).json({
      status : 'success',
      page,
      totalPages,
      data :   attendances
    });

  }catch(error) {
    next(error);
  }
} 

const getAllAttendances = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status :  'error',
        message : 'Unauthorized access',
      });
    }

    const payload = jwt.verify(token, process.env.TOKEN_KEY);

    const page = parseInt(req.query.page) || 1; // Current page (default: 1)
    const limit = parseInt(req.query.limit) || 10; // Number of documents per page (default: 10)
    const skip = (page - 1) * limit; // Number of documents to skip

    const attendances = await Attendance.find({
      employee : payload.userId })
      .populate({
        path :   'employee',
        select : 'firstName lastName',
    })
      .skip(skip)
      .limit(limit);

      // const nextPage = page < totalPages - 1 ? page + 1 : null;
      // const prevPage = page > 0 ? page - 1 : null;

    const totalPages = Math.ceil(
      (await Attendance.countDocuments({})) / limit
    );

    res.status(200).json({
      status : 'success',
      page,
      totalPages,
      data :   attendances,
    });
  } catch (error) {
    next(error);
  }
};


const updateBalanceVacations = async (employeeId, BalanceVacations) => {
  const employee = await Employee.findById(employeeId);
  console.log('employee', employee);
  const vacation = await Vacation.updateMany({employeeId : employee._id},
    { totalDays : BalanceVacations }
  );

  return vacation;
}

const updateDeductions = async (employeeId, deduction) => {
  const employee = await Employee.findById(employeeId);
  const payroll = await Payroll.findOneAndUpdate({employeeId : employee._id},
    { deduction : deduction }
  );
  return payroll;
}

// Check-in route
// Set the default workday start and end times
const DEFAULT_START_TIME = 1; // 9:00 AM
const DEFAULT_END_TIME = 23; // 6:00 PM

const checkIn = async (req, res, next) => {
  try {
    // Check if the employee ID is valid
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({
        status :  'error',
        message : 'Unauthorized access',
      });
    }
    const payload = jwt.verify(token, process.env.TOKEN_KEY);

    const employee = await Employee.findById(req.body.employee);
    if (!employee) {
      return res.status(400).json({ message : 'Invalid employee ID' });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to midnight
    const attendance = await Attendance.findOne({
      employee : employee._id,
      checkIn :  { $gte : today },
    });
    const pre = await Attendance.findOne({
      employee : employee._id,
    }).sort({ checkIn : -1 });
    console.log( 'pre ' + pre);
    if (attendance) {
      return res.status(400).json({
        message : 'Employee has already checked in today',
      });
    }

    // Create a new attendance record

    const newAttendance = new Attendance({
      employee : employee._id,
      checkIn :  new Date(),
    });
    try {
      await newAttendance.validate();
    } catch (error) {
      return res.status(400).json({ message : error.message });
    }
    await newAttendance.save();
    const startTime = this.workdayStartTime || DEFAULT_START_TIME;
    const endTime = this.workdayEndTime || DEFAULT_END_TIME;
    const lateThreshold = new Date(newAttendance.checkIn.getTime());
    lateThreshold.setMinutes(lateThreshold.getMinutes() + 15); // 15-minute grace period

    if (
      newAttendance.checkIn > lateThreshold ||
      newAttendance.checkIn.getHours() >= endTime
    ) {
      // Check if check-in time is after workday end time or after the grace period

      return false;
    }
    const startOfDay = new Date(newAttendance.checkIn.getTime());
    startOfDay.setHours(0, 0, 0, 0); // set the start of the day to midnight

    const endOfDay = new Date(newAttendance.checkIn.getTime());
    endOfDay.setHours(23, 59, 59, 999); // set the end of the day to 11:59 PM and 999 milliseconds
  
    const attendances = await Attendance.find({
      employee : employee._id,
      checkIn :  {
        $gte : startOfDay,
        $lt :  endOfDay,
      },
    });
    const startWorking = new Date();
    startWorking.setHours(DEFAULT_START_TIME, 0, 0, 0); // Set the hours, minutes, seconds, and milliseconds to the start time
    startWorking.setHours(startWorking.getHours() + 2);
    attendances[0].lateCounter = attendances[0].lateCounter + pre.lateCounter;
    attendances[0].deduction = attendances[0].deduction + pre.deduction;
    attendances[0].lateExcuse = attendances[0].lateExcuse + pre.lateExcuse;
    attendances[0].BalanceVacations = attendances[0].BalanceVacations + pre.BalanceVacations;

    if (attendances[0].checkIn.getTime() >= startWorking.getTime()) {
      attendances[0].lateExcuse = attendances[0].lateExcuse + 1;

      if (attendances[0].lateExcuse > 2) {
        attendances[0].BalanceVacations = attendances[0].BalanceVacations + 0.5;
        const updateBalanceVacation = updateBalanceVacations(attendances[0].employee, attendances[0].BalanceVacations);
        await updateBalanceVacation;
      
      }
      attendances[0].save();
    } else {
      const lateArrivals = attendances.filter(
        (a) => a.checkIn.getTime() <= lateThreshold.getTime()
      ).length;
      if (lateArrivals == 1 ) {
        if (attendances[0].lateCounter == 0) {
          attendances[0].lateCounter = 1;
          console.log(
            'Warning: This is your first late arrival. No deductions will be calculated for now.'
          );
        } else {
          attendances[0].lateCounter += 1;
        }
        await attendances[0].save(); // Save the updated employeeData
      } else {
        // Calculate deductions based on the late counter

        let deduction;
        if (attendances[0].lateCounter == 0) {
          attendances[0].lateCounter = 1;
        } else {
          if (attendances[0].lateCounter === 1) {
            deduction = 0.1; // Second late arrival - deduct 10%
          } else if (attendances[0].lateCounter === 2) {
            deduction = 0.2; // Third late arrival - deduct 20%
          } else if (attendances[0].lateCounter === 3) {
            deduction = 0.25; // Fourth late arrival - deduct 25%
          } else if (attendances[0].lateCounter === 4) {
            deduction = 0.5; // Fifth late arrival - deduct 50%
          } else {
            deduction = 1; // Fifth or more late arrival - deduct 100%
          }
          attendances[0].deduction = attendances[0].deduction + deduction;

          const updateDeduction = updateDeductions(attendances[0].employee, attendances[0].deduction);
         console.log('updateDeduction', updateDeduction);
          await updateDeduction;
        }
        attendances[0].lateCounter += 1;
        await attendances[0].save();
      }
    }

    res.json(attendances[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message : 'Internal server error' });
  }
};

// Check-out route

const checkOut = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.body.employee);
    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const attendance = await Attendance.findOne({
      employee : employee,
      checkIn :  { $gte : startDate, $lt : endDate }
    });

    if (!attendance) {
      return res
        .status(400)
        .json({ message : 'Employee has not checked in today' });
    }

    // Check if the employee has already checked out

    if (attendance.checkOut) {
      return res
        .status(400)
        .json({ message : 'Employee has already checked out' });
    }

    // Check if the employee has checked in

    if (!attendance.checkIn) {
      return res
        .status(400)
        .json({ message : 'Employee has not checked in yet' });
    }

    // Update the Attendance document with the current time as the check-out time

    attendance.checkOut = new Date();
    await attendance.save();

    const startTime = this.workdayStartTime || DEFAULT_START_TIME;
    const endTime = this.workdayEndTime || DEFAULT_END_TIME;
    const earlThreshold = new Date(attendance.checkOut.getTime());
    earlThreshold.setMinutes(earlThreshold.getMinutes());

    if (
      attendance.checkOut > earlThreshold ||
      attendance.checkOut.getHours() >= endTime
    ) {
      // Check if check-in time is after workday end time or after the grace period

      return false;
    }

    const startOfDay = new Date(attendance.checkOut.getTime());
    startOfDay.setHours(0, 0, 0, 0); // set the start of the day to midnight
    const endOfDay = new Date(attendance.checkOut.getTime());
    endOfDay.setHours(23, 59, 59, 999); // set the end of the day to 11:59 PM and 999 milliseconds

    const attendances = await Attendance.find({
      employee : employee._id,
      checkOut : {
        $gte : startOfDay,
        $lt :  endOfDay,
      },
    });

    const endWorking = new Date();
    endWorking.setHours(DEFAULT_END_TIME, 0, 0, 0); // Set the hours, minutes, seconds, and milliseconds to the start time
    endWorking.setHours(endWorking.getHours() - 2);

    if (attendances[0].checkOut.getTime() <= endWorking.getTime()) {
      attendances[0].lateExcuse = attendances[0].lateExcuse + 1;
      if (attendances[0].lateExcuse > 2) {


        attendances[0].BalanceVacations += 0.5;
        const updateBalanceVacation = updateBalanceVacations(attendances[0].employee, attendances[0].BalanceVacations);
        await updateBalanceVacation;
      
      }
      attendances[0].save();
    } else {
      const earlyLeaves = attendances.filter(
        (a) => a.checkOut.getTime() >= earlThreshold.getTime()
      ).length;
      if (earlyLeaves == 0) {
        if (attendances[0].lateCounter == 0) {
          attendances[0].lateCounter = 1;
          console.log(
            'Warning: This is your first early leaves. No deductions will be calculated for now.'
          );
        } else {
          attendances[0].lateCounter += 1;
        }
        await attendances[0].save(); // Save the updated employeeData
      } else {
        // Calculate deductions based on the late counter

        let deduction;
        if (attendances[0].lateCounter == 0) {
          attendances[0].lateCounter = 1;
        } else {
          if (attendances[0].lateCounter === 1) {
            deduction = 0.1; // Second late arrival - deduct 10%
          } else if (attendances[0].lateCounter === 2) {
            deduction = 0.2; // Third late arrival - deduct 20%
          } else if (attendances[0].lateCounter === 3) {
            deduction = 0.25; // Fourth late arrival - deduct 25%
          } else if (attendances[0].lateCounter === 4) {
            deduction = 0.5; // Fifth late arrival - deduct 50%
          } else {
            deduction = 1; // Fifth or more late arrival - deduct 100%
          }

          attendances[0].deduction = attendances[0].deduction + deduction;
          const updateDeduction = updateDeductions(attendances[0].employee, attendances[0].deduction);
   
           await updateDeduction;
          attendances[0].lateCounter += 1;
        }
        await attendances[0].save();
      }
    }
    return res.json(attendances[0]);
  } catch (error) {
    res.status(500).json({ message : 'Internal server error' });
  }
};

module.exports = {
  create,
  getAttendanceById,
  updateAttendanceById,
  deleteAttendanceById,
  checkIn,
  checkOut,
  getAllAttendancesOfEmployee,
  getAllAttendances,
};
