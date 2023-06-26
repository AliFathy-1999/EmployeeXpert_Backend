const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const schema = new Schema(
  {
message:{
  type:String,
  required: true,
  unique: true,
  trim: true,
},
sender:{
  type                : mongoose.Schema.Types.ObjectId,
  ref                 : 'Employee',
  required: true,
} ,

recieverEmp:{
  type                : mongoose.Schema.Types.ObjectId,
  ref                 : 'Employee',
} ,

recieverDep:{
  type                : mongoose.Schema.Types.ObjectId,
  ref                 : 'Department',
} ,

all:{
  type:Boolean,
},

    
  })

   const Communications = model('Communications',schema);
   module.exports = Communications;