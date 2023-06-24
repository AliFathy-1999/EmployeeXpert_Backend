let mongoose, { Schema, model } = require('mongoose');

const schema = new Schema({
    name : {
        type :     String,
        required : true,
        unique :   true,
        trim :     true,
    },
    description : {
        type :     String,
        required : true,
        trim :     true,
    },
    location : {
        type :     String,
        required : true
    },
}  
, {
    timestamps : true,
}
)

const Department = model('Department', schema);
module.exports = Department;