let mongoose, { Schema, model } = require('mongoose');

const schema = new Schema(
    {
        grossSalary:{
            type:Number,
            required:[true,'Gross Salary of Employee is Required'],
            min:0
        },
        payRate:{
            type:Number,
            required:[true,'Pay Rate is Required'] ,
            min:0,
            default:function(){
                return this.grossSalary / 25
            }
        },
        DaysWorked:{
            type:Number,
            required:[true,'Days Employee Worked is Required'] ,
            min:0,
            max:25
        },
        tax:{
            type:Number,
            required:[true,'Tax is Required'],
            min:0
        },
        Bonus:{
            type:Number,
            required:[true,'Bonus is Required'],
            min:0
        },
        netSalary:{
            type:Number,
            required:[true,'Net Salary is Required'],
            min:0,
            default: function() {
                return this.grossSalary - this.tax + this.Bonus;
            }
        },
        employeeId:{
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        }
    })

    const Payroll=model('Payroll',schema)
    module.exports=Payroll;