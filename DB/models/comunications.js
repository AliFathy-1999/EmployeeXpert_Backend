const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const CommunicationSchema = new Schema({
  message : {
    type :     String,
    required : true,
    trim :     true,
  },
  sender : {
    type :     Schema.Types.ObjectId,
    ref :      'Employee',
    required : true,
  },
  Emp : {
    type : Schema.Types.ObjectId,
    ref :  'Employee',
  },
  Dep : {
    type : Schema.Types.ObjectId,
    ref :  'Department',
  },
  All : {
    type : Boolean,
  },
},
{
    timestamps : true,
    toObject :   { getters : true },
    toJSON :     { getters : true },
}
)
  
const communications = model('CommunicationSchema', CommunicationSchema);
module.exports = communications;