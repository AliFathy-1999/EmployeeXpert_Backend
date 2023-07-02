const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Employee = require('./employee'); // import the Employee model
const Payroll = require('./payroll'); // import the Payroll model

// Set the default workday start and end times
const DEFAULT_START_TIME = 5; // 9:00 AM
const DEFAULT_END_TIME = 24; // 11:00 PM

// Define the Attendance schema
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
        const startTime = this.workdayStartTime || DEFAULT_START_TIME;
        const endTime = this.workdayEndTime || DEFAULT_END_TIME;
        return v.getHours() >= startTime || v.getHours() < endTime;
      },
      message: 'Check-in time must be between workday start and end times'
    }
  },
  checkOut: {
    type: Date,
    validate: {
      validator: function(v) {
        const startTime = this.workdayStartTime || DEFAULT_START_TIME;
        const endTime = this.workdayEndTime || DEFAULT_END_TIME;
        return v.getHours() >= startTime || v.getHours() < endTime + 4;
      },
      message: 'Check-out time must be between workday start and end times, plus a grace period of 4 hours'
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
  // Define the start and end times of the workday as comments
  workdayStartTime: {
    type: Number,
    min: 0,
    max: 23
  },
  workdayEndTime: {
    type: Number,
    min: 0,
    max: 23
  },
    lateCounter: {
      type: Number,
      default: 0
    },
    BalanceVacations:{
      type :  Number,
      default : 0
  }
  }, {
    timestamps: true  // add timestamps to each document
});

AttendanceSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    delete ret.__v;

  }
});

AttendanceSchema.plugin(mongoosePaginate);

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;