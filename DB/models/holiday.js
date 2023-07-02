let mongoose, { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const holiday = new Schema({

    holidayName:{
        type :      String,
        required :  [true, 'Holiday required'],
        trim :      true,
        minLength : [3, 'Holiday must be at least 3 characters'],
        maxLength : [100, 'Holiday must be less than 100 characters'],
    },   
    holidayDate:{
        type:Date,
        required :  [true, 'Date of the holiday is required'],
    },
    noOfDays:{
        type : Number,
        min:0
    }
})

holiday.plugin(mongoosePaginate);

const Holiday = model('Holiday', holiday);

module.exports = Holiday;