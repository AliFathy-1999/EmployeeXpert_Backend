let mongoose, { Schema, model } = require('mongoose');
const excuse = new Schema({

employeeId : {
        type :     Schema.Types.ObjectId,
        ref :      'Employee',
        required : true
    },
reason : {
    type :      String,
    required :  [true, 'Reason for this Lateness is required'],
    trim :      true,
    minLength : [5, 'Reason must be at least 5 characters'],
    maxLength : [200, 'Reason must be less than  200 characters'],
},
day : {
   type :    Date,
   default : new Date(Date.now() + 24 * 60 * 60 * 1000),
},
from: {
    type: Date,
    required: [true, 'Start hour of lateness is required'],
    set: function (value) {
      return new Date(value);
    },
    validate: {
      validator: function (value) {
        const toDate = new Date(this.to);
        const fromDate = new Date(value);
        return validator.isBefore(fromDate, toDate);
      },
      message: 'Start hour of lateness must be before end hour'
    }
  },
  to: {
    type: Date,
    max: new Date().setHours(18, 0),
    required: [true, 'End hour is required'],
    set: function (value) {
      return new Date(value);
    },
    validate: {
      validator: function (value) {
        const fromDate = new Date(this.from);
        const toDate = new Date(value);
        return validator.isAfter(toDate, fromDate);
      },
      message: 'End hour must be after start hour of lateness'
    }
  },
// from : {
//     type :     Date,
//     default :  new Date().setHours(9, 0),
//     required : [true, 'Start hour of Lateness is required'],
//     validate: {
//         validator: function (value) {
//           const toDate = new Date(this.to);
//           const fromDate = new Date(value);
//           return validator.isBefore(fromDate, toDate);
//         },
//         message: 'Start hour of Lateness must be before End hour'
//       }
//     // validate : {
//     //     validator : function(value) {
//     //         return value < this.to;
//     //     },
//     //     message : 'Start hour must be before end hour'
//     // }
// },
// to : {
//     type :     Date,
//     default :  new Date().setHours(10, 0),
//     max :      new Date().setHours(18, 0),
//     required : [true, 'End hour is required'],
//     validate: {
//         validator: function (value) {
//           const fromDate = new Date(this.from);
//           const toDate = new Date(value);
//           return validator.isAfter(toDate, fromDate);
//         },
//         message: 'End hour must be after Start hour of Lateness'
//       }
//     // validate : {
//     //     validator : function(value) {
//     //         return value > this.from;
//     //     },
//     //     message : 'End hour must be after start hour'
//     // }
// },
respond : {
    type :    String,
    enum :    ['Pending', 'Accepted', 'Rejected'],
    default : 'Pending'
},
noOfExcuses : {
type :    Number,
min :     0,
default : 0,
},

typeOfExcuse : {
    type :     String,
    enum :     ['Late', 'Leave Early'],
    required : true
}

});
excuse.pre('save', function(next) {
    if (this.reason) {
      this.reason = this.reason.trim();
    }
    next();
  });
const Excuse = model('Excuse', excuse);

module.exports = Excuse;