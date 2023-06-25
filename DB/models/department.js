const { ObjectId } = require('mongodb');

let mongoose, { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const schema = new Schema({
    name : {
        type :      String,
        required :  true,
        unique :    true,
        trim :      true,
        minlength : 3, 
        maxlength : 50,
        match :     /^[A-Za-z\s]+$/,
        validate :  {
          validator : function (value) {
            if (!value.match(/^[A-Za-z\s]+$/)) {
              throw new AppError('name must contain only alphabetic characters', 400);
            }
          },
        },
    },
    description : {
        type :      String,
        required :  true,
        trim :      true,
        minlength : 5, 
        maxlength : 255,
        match :     /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]*$/,
        validate :  {
          validator : function (value) {
            if (!value.match(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]*$/)) {
              throw new AppError('Description must contains at least one letter and numbers', 400);
            }
          },
        }, 
    },
    managerId : {
        type :     Schema.Types.ObjectId,
        ref :      'Employee',
        required : true
    },
    
}  
, {
    timestamps : true,
}
)
schema.plugin(mongoosePaginate);
const Department = model('Department', schema);
module.exports = Department;