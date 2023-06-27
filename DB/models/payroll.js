let mongoose, { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new Schema(
    {
      grossSalary : {
        type :     Number,
        required : [true, 'Gross Salary of Employee is Required'],
        min :      3500,
      },
      payRate : {
        type : Number,
        min :  0,
        get :  function() {
          return this.grossSalary / 25;
        },
      },
      daysWorked : {
        type :     Number,
        required : [true, 'Days Employee Worked is Required'],
        min :      0,
        max :      25,
      },
      tax : {
        type : Number,
        min :  0,
        get :  function() {
          if (this.grossSalary < 10000) {
            return 0;
          } else if (this.grossSalary < 15000) {
            return 0.15;
          } else if (this.grossSalary < 35000) {
            return 0.20;
          } else {
            return 0.25;
          }
        },
      },
      bonus : {
        type :     Number,
        required : [true, 'Bonus is Required'],
        min :      0,
        default :  0,
      },
      netSalary : {
        type : Number,
        min :  0,
        get :  function() {
          return this.grossSalary - this.grossSalary * this.tax + this.bonus;
        },
      },
      employeeId : {
        type :     Schema.Types.ObjectId,
        ref :      'Employee',
        required : true,
      },
    },
    {
      timestamps : true,
      toObject :   { getters : true },
      toJSON :     { getters : true },
    }
  );


    schema.plugin(mongoosePaginate);

    const Payroll = model('Payroll', schema)
    module.exports = Payroll;