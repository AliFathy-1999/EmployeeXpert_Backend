let mongoose, { Schema, model } = require('mongoose');

const CommunicationSchema = new Schema({
  title : {
    type :      String,
    minLength : [5, 'Title must be at least 5 characters'],
    maxLength : [100, 'Title must be at less than 1005 characters'],
    required :  [true, 'First name is a required field'],
    trim :      true,
    match :   /^[A-Za-z\s]+$/,
    validate(value) {
      if (!value.match(/^[A-Za-z\s]+$/)) {
        throw new AppError('Title should contain alphabetic characters only', 400);
      }
    },
  },
  message : {
    type :      String,
    required :  true,
    trim :      true,
    minlength : [5, 'Message must be at least 5 character long'],
    maxlength : [300, 'Message cannot exceed 300 characters'],
    match :     /[a-zA-Z\s]+/,
    validate :  {
      validator : function (value) {
        if (!value.match(/[a-zA-Z\s]+/)) {
          throw new AppError('Message must contain at least one alphabetic characters', 400);
        }
      },
    }, 
  },
  sender : {
    type :     Schema.Types.ObjectId,
    ref :      'Employee',
    required : true,
  },
  employee : {
    type : Schema.Types.ObjectId,
    ref :  'Employee',
  },
  department : {
    type : Schema.Types.ObjectId,
    ref :  'Department',
  },
  isForAll : {
    type :    Boolean,
    default : false,
  },
},
{
    timestamps : true,
    toObject :   { getters : true },
    toJSON :     { getters : true },
})
  
const communications = model('Communication', CommunicationSchema);
module.exports = communications;