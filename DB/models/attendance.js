const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Employee = require('./employee'); // import the Employee model
const Payroll = require('./payroll'); // import the Payroll model
const AttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  checkIn: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v.getHours() >= 9 && v.getHours() < 18;
      },
      message: 'Check-in time must be between 9:00 AM and 6:00 PM'
    }
  },
  checkOut: {
    type: Date,
    validate: {
      validator: function(v) {
        return v.getHours() >= 9 && v.getHours() < 22;
      },
      message: 'Check-out time must be between 9:00 AM and 10:00 PM'
    }
  },
  lateExcuse: {
    type: Number,
    default: 0
  },
  deduction:{
    type: Number,
    default: 0 
  },
  payRate:{
    type: Number,
    ref: 'Payroll',    
    required: false,
  }
});


AttendanceSchema.path('checkIn').validate(function(value) {
  const lateThreshold = new Date(value.getTime());
  lateThreshold.setMinutes(lateThreshold.getMinutes() + 15); // 15-minute grace period
  if (value > lateThreshold || value.getHours() >= 18) { 
    // Check if check-in time is after 6 PM or after the grace period
    return false;
  }
  const employee = this.employee; 
  const date = value.toISOString().slice(0, 10); // get the date in ISO format
  Attendance.find({ employee: employee, 
    checkIn: {
      $gte: new Date(date), 
      $lt: new Date(date + 'T23:59:59.999Z') 
    } })
    .then((attendances) => {
      let lateArrivals = attendances.filter((a) => a.checkIn > lateThreshold).length;
      if (lateArrivals === 0) {
        // First late arrival - no deduction but issue a warning
        console.log("Warning: This is your first late arrival. No deductions will be calculated for now.");
      } else {
        // Increment the late counter
        const employeeData = Employee.findById(employee);
        if (employeeData.lateCounter) {
          employeeData.lateCounter += 1;
        } else {
          employeeData.lateCounter = 1;
        }
        // Calculate deductions based on the late counter
        switch(employeeData.lateCounter) {
          case 1:
            // Second late arrival - deduct 10%
            this.deduction = 0.1;
            break;
          case 2:
            // Third late arrival - deduct 20%
            this.deduction = 0.2;
            break;
          case 3:
            // Fourth late arrival - deduct 25%
            this.deduction = 0.25;
            break;
          default:
            // Fifth or more late arrival - deduct 50%
            this.deduction = 0.5;
            break;
        }
        // Check if the deduction exceeds the daily salary
        const payrollData = Payroll.findById(employeeData.payroll);
        const dailySalary = payrollData.payRate;
        if (this.deduction * dailySalary >= dailySalary) {
          this.deduction = 1; // Deduct the full day's salary
        }
        this.payRate = payrollData.payRate;
      }
    });
  return true;
}, 'Employee arrived too late or after work hours');

AttendanceSchema.path('checkOut').validate(function(value) {
  if (value && value.getHours() >= 18) { // Check if check-out time is after 6 PM
    return false;
  }
  return true;
}, 'Employee checked out after work hours');



AttendanceSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  }
});


AttendanceSchema.plugin(mongoosePaginate);
// Add timestamps for the checkIn and checkOut fields
AttendanceSchema.set('timestamps', true);

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;