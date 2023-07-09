const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const leaveReportSchema = new Schema({
  employeeId : {
    type :     Schema.Types.ObjectId,
    ref :      'Employee',
    required : true
},
reason : {
type :      String,
// required :  [true, 'Reason for this Lateness is required'],
// trim :      true,
// minLength : [5, 'Reason must be at least 5 characters'],
// maxLength : [200, 'Reason must be less than  200 characters'],
},
day : {
type :    Date,
// default : new Date(Date.now() + 24 * 60 * 60 * 1000),
},
from : {
type :     Date,
// default :  new Date().setHours(9, 0),
// required : [true, 'Start hour of Lateness is required'],
},
to : {
type :     Date,
// default :  new Date().setHours(10, 0),
// required : [true, 'End hour is required'],
// max :      new Date().setHours(18, 0),
},
respond : {
type :    String,
// enum :    ['Pending', 'Accepted', 'Rejected'],
// default : 'Pending'
},
noOfExcuses : {
type :    Number,
min :     0,
// default : 0,
},

typeOfExcuse : {
type :     String,
// enum :     ['Late', 'Leave Early'],
// required : true
},
  remaningLeaves: {
    type: Number,
    min: 0,
    max: 24,
    default: 24
  },
  totalLeaves: {
    type: Number,
    min: 0,
    default: 0
  },
});


leaveReportSchema.plugin(mongoosePaginate);

const LeaveReport = model('LeaveReport', leaveReportSchema);

module.exports = LeaveReport;