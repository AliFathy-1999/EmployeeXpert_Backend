let mongoose, { Schema, model } = require('mongoose');

const schema = new Schema(
    {
      reasonForVacation: {
        type: String,
        trim: true,
        minlength: [5, 'Reason must be at least 5 characters'],
        maxlength: [200, 'Reason must be less than 200 characters'],
      },
        fromDay : {
          type : Date,

          // required : [true, 'Start date of vacation is required'],

          validate : {
              validator : function(value) {
                  return value <= this.toDay;
              },
              message : 'from date must be before end date'
          }
      },
      toDay : {
          type : Date,

          // required : [true, 'End date of vacation is required'],

          validate : {
              validator : function(value) {
                  return value >= this.fromDay;
              },
              message : 'End date must be after start date'
          }
      },

        totalDays : {
            type :     Number,
            default :  0,
            validate : {
              validator : function(value) {
                if (value <= 21) {
                  return true;
                }
                return false

              },
            }
          },

          maxDays : {
            type :     Number,
            default :  22,
            validate : {
              validator : function(value) {
                if (value >= 22) {
                  return true;
                }
                return false;

              },
            }
          },


        status : {
            type :    String,
            enum :    ['Pending', 'Accepted', 'Declined'],
            default : 'Pending'
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
    const Vacation = model('Vacation', schema);

    module.exports = Vacation;