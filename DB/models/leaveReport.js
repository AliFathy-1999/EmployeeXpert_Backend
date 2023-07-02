let mongoose, { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const leaveReportSchema = new Schema({
    employeeId : {
        type :     Schema.Types.ObjectId,
        ref :      'Employee',
        required : true
    },
    depId : {
        type :     Schema.Types.ObjectId,
        ref :      'Department',
        required : true
    },
    excuseId : {
        type :     Schema.Types.ObjectId,
        ref :      'Excuse',
        required : true
    }
})

leaveReportSchema.plugin(mongoosePaginate);

const leaveReport = model('leaveReport', leaveReportSchema);

module.exports = leaveReport;