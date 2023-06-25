const { ObjectId } = require('mongodb');

let mongoose, { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const schema = new Schema({
    name : {
        type :     String,
        required : true,
        unique :   true,
        trim :     true,
    },
    description : {
        type :      String,
        required :  true,
        trim :      true,
        minlength : 5, 
        maxlength : 255,
        match :     /[a-zA-Z]+/,
        validate :  {
          validator : function (value) {
            if (!value.match(/[a-zA-Z]+/)) {
              throw new AppError('description must contain at least one alphabetic characters', 400);
            }
          },
        }, 
    },
    mangerId : {
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