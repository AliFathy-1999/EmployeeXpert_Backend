let mongoose, { Schema, model, now } = require('mongoose');
const moment = require('moment');
const schema = new Schema(
    {
      reasonForVacation: {
        type: String,
        trim: true,
        default: "casual Vacation"
      },
        Day : {
            type: Date,
            default: new Date(Date.now() + 24 * 60 * 60 * 1000)

    },
    //   toDay : {
    //       type : Date,
    //       default: Date.now(),

    //       // required : [true, 'End date of vacation is required'],
    //       max: moment().add(1, 'day').endOf('day').toDate(),

    //   },
    totalCasDays:{
        type:Number,
        default:1,
        max:2,
    },


        status : {
            type :    String,
            default : 'Accepted'
        },
        casualVacation:{
          type: Number,
          default:0,
          validate : {
            validator : function(value) {
              if (value <= 7) {
                return true;
              }
              return false;

            },
          }
        },
        employeeId : {
            type :     Schema.Types.ObjectId,
            ref :      'Employee',
            required : true
        },
    });
    schema.pre('save', function(next) {
        if (this.reasonForVacation) {
          this.reasonForVacation = this.reasonForVacation.trim();
        }
        next();
      });
    const casualVacations = model('casualVacations', schema);

    module.exports = casualVacations;