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
            min:0,
            default:function(){
                return this.grossSalary / 25
            }
        },
        daysWorked:{
            type:Number,
            required:[true,'Days Employee Worked is Required'] ,
            min:0,
            max:25
        },
        tax:{
            type:Number,
            min:0,
            default:0.15,
        },
        bonus:{
            type:Number,
            required:[true,'Bonus is Required'],
            min:0
        },
        netSalary:{
            type:Number,
            min:0,
            default: function() {
                return this.grossSalary - (this.grossSalary * this.tax + this.bonus);
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