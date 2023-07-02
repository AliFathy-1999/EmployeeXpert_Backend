const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Employee = require('./employee'); // import the Employee model
const Payroll = require('./payroll'); // import the Payroll model

// Set the default workday start and end times
const DEFAULT_START_TIME = 5; // 9:00 AM
const DEFAULT_END_TIME = 24; // 11:00 PM

// Define the Attendance schema

const AttendanceSchema = new mongoose.Schema({
  employee : {
    type :     mongoose.Schema.Types.ObjectId,
    ref :      'Employee',
    required : true
  },
  checkIn : {
    type :     Date,
    required : true,
    validate : {
      validator : function(v) {
        const startTime = this.workdayStartTime || DEFAULT_START_TIME;
        const endTime = this.workdayEndTime || DEFAULT_END_TIME;
        return v.getHours() >= startTime || v.getHours() < endTime;
      },
      message : 'Check-in time must be between workday start and end times'
    }
  },
  checkOut : {
    type :     Date,
    validate : {
      validator : function(v) {
        const startTime = this.workdayStartTime || DEFAULT_START_TIME;
        const endTime = this.workdayEndTime || DEFAULT_END_TIME;
        return v.getHours() >= startTime || v.getHours() < endTime + 4;
      },
      message : 'Check-out time must be between workday start and end times, plus a grace period of 4 hours'
    }
  },
  lateExcuse : {
    type :    Number,
    default : 0
  },
  deduction : {
    type :    Number,
    default : 0 
  },
  payRate:{
    type: Number,
    ref: 'Payroll',    
    required: false,
  },
  // Define the start and end times of the workday as comments

  workdayStartTime : {
    type : Number,
    min :  0,
    max :  23
  },
  workdayEndTime : {
    type : Number,
    min :  0,
    max :  23
  },
    lateCounter : {
      type :    Number,
      default : 0
    }
  }, {
    timestamps: true  // add timestamps to each document
});


// Validate the check-in time
// AttendanceSchema.path('checkIn').validate(async function(value) {
//   const startTime = this.workdayStartTime || DEFAULT_START_TIME;
//   const endTime = this.workdayEndTime || DEFAULT_END_TIME;
//   const lateThreshold = new Date(value.getTime());
//   lateThreshold.setMinutes(lateThreshold.getMinutes() + 15); // 15-minute grace period
//   if (value > lateThreshold || value.getHours() >= endTime) { 
//     // Check if check-in time is after workday end time or after the grace period
//     return false;
//   }
//   const employee = this.employee; 
  
//   const startOfDay = new Date(value.getTime());
//   startOfDay.setHours(0, 0, 0, 0); // set the start of the day to midnight
//   const endOfDay = new Date(value.getTime());
//   endOfDay.setHours(23, 59, 59, 999); // set the end of the day to 11:59 PM and 999 milliseconds
  
//   const attendances = await Attendance.find({ employee: employee, checkIn: { $gte: startOfDay, $lt: endOfDay } });
//   const lateArrivals = attendances.filter((a) => a.checkIn > lateThreshold).length;
  
//   if (lateArrivals == 0) {
//     // First late arrival - no deduction but issue a warning
//     // Increment the late counter
//     const employeeData = await Employee.findById(employee);
//     console.log(`employeeData ${employeeData}`);
//     console.log(employeeData.lateCounter)
//     if (employeeData.lateCounter == 0) {
//       console.log("hello");

//       employeeData.lateCounter = 1;
//     } else {
//       employeeData.lateCounter += 1;
//       console.log("hello2");

//     }
//     await employeeData.save(); // Save the updated employeeData
//     console.log("Warning: This is your first late arrival. No deductions will be calculated for now.");
//   } else {
//     // Calculate deductions based on the late counter
//     const employeeData = await Employee.findById(employee);
//     if (employeeData.lateCounter == 0) {
//       employeeData.lateCounter = 1;
//     } else {
//       switch (employeeData.lateCounter) {
//         case 1:
//           // Second late arrival - deduct 10%
//           this.deduction = 0.1;
//           break;
//         case 2:
//           // Third late arrival - deduct 20%
//           this.deduction = 0.2;
//           break;
//         case 3:
//           // Fourth late arrival - deduct 25%
//           this.deduction = 0.25;
//           break;
//         default:
//           // Fifth or more late arrival - deduct 50%
//           this.deduction = 0.5;
//           break;
//       }
//       // Check if the deduction exceeds the daily salary
//       const payrollId = employee.payroll;
//       const payroll = await Payroll.findById(payrollId);
//       const dailySalary = payroll.payRate;
//       if (this.deduction * dailySalary >= dailySalary) {
//         this.deduction = 1; // Deduct the full day's salary
//       }
//     }
//     this.payRate = payroll.payRate;
//     // Increment the late counter
//     employeeData.lateCounter += 1;
//     await employeeData.save();
//   }
//   return true;
// }, 'Employee arrived too late or after workday end time');

// Validate the check-out time
AttendanceSchema.path('checkOut').validate(function(value) {
  const startTime = this.workdayStartTime || DEFAULT_START_TIME;
  const endTime = this.workdayEndTime || DEFAULT_END_TIME;
  if (value && value.getHours() >= endTime + 4) { // Check if check-out time is after workday end time, plus a grace period of 4 hours
    return false;
  }
  return true;
}, 'Employee checked out after workday end time, plus a grace period of 4 hours');


AttendanceSchema.set('toJSON', {
  virtuals :  true,
  transform : function(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    delete ret.__v;

  }
});

AttendanceSchema.plugin(mongoosePaginate);

// Update the attendance record every 10 minutes
setInterval(() => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // set the start of the day to midnight
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // set the end of the day to 11:59 PM and 999 milliseconds
  Attendance.find({checkOut: { $exists: false }, checkIn: { $gte: startOfDay, $lt: endOfDay } })
    .then((attendances) => {
      attendances.forEach((attendance) => {
        attendance.checkOut = new Date();
        attendance.save();
      });
    });
}, 10 * 60 * 1000); // 10 minutes in milliseconds


const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;