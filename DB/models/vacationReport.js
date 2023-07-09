let mongoose, { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const vacationReportSchema = new Schema(
    {
            reasonForVacation: {
               type: String,
          },
            fromDay : {
               type : Date,    
          },
          toDay : {
              type : Date,
          },
          totalDays : {
                type : Number,
              },
          maxDays : {
                type : Number,
              },
          status : {
                type : String,
            },
            employeeId : {
                type :     Schema.Types.ObjectId,
                ref :      'Employee',
                required : true
            },
        },
    {
      timestamps : true,
      toObject :   { getters : true },
      toJSON :     { getters : true },
    });

    vacationReportSchema.plugin(mongoosePaginate);

    const vacationReport = model('vacationReport', vacationReportSchema);

    module.exports = vacationReport;