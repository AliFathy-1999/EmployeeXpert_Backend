const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const leaveReportSchema = new Schema({
  employeeId: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  }],
  depId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
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
  excuseId: {
    type: Schema.Types.ObjectId,
    ref: 'Excuse',
  }
});


leaveReportSchema.plugin(mongoosePaginate);

const LeaveReport = model('LeaveReport', leaveReportSchema);

module.exports = LeaveReport;