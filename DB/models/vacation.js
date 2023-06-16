let mongoose, { Schema, model } = require('mongoose');

const schema = new Schema(
    {
        reasonForVacation:{
            type:String,
            required:[true,'Reason for this Vacation is required'],
            trim:true,
            minLength: [5, 'Reason must be at least 5 characters'],
            maxLength: [100, 'Reason must be less than  100 characters'],
        },
        fromDay:{
            type:Date,
            required:[true,'Start date of vacation is required'],
            validate: {
                validator: function(value) {
                    return value <= this.toDay;
                },
                message: 'End date must be before end date'
            }
        },
        toDay:{
            type:Date,
            required:[true,'End date of vacation is required'],
            validate: {
                validator: function(value) {
                    return value >= this.fromDay;
                },
                message: 'End date must be after start date'
            }
        },
        status:{
            type:String,
            enum: ['Pending', 'Accepted', 'Declined'],
            default: 'Pending'
        },
        employeeId:{
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        }
    })
    const Vacation=model('Vacation',schema);
    module.exports=Vacation;