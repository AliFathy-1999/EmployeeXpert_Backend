let mongoose, { Schema, model } = require('mongoose');
const vacationReportSchema = new Schema(
    {
        vacationId : {
            type :     Schema.Types.ObjectId,
            ref :      'Vacation',
            required : true
        },

        employeeId : {
            type :     Schema.Types.ObjectId,
            ref :      'Employee',
            required : true
        }
    });
    const vacationReport = model('vacationReport', vacationReportSchema);

    module.exports = vacationReport;