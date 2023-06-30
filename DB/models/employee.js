let mongoose, { Schema, model } = require('mongoose');
const { AppError } = require('../../lib');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate-v2');
const schema = new Schema(
  {
    firstName : {
      type :      String,
      minLength : [3, 'First name must be at least 3 characters'],
      maxLength : [15, 'First name must be at less than 15 characters'],
      required :  [true, 'First name is a required field'],
      trim :      true,
      match :     /^[A-Za-z]+$/,
      validate(value) {
        if (!value.match(/^[A-Za-z]+$/)) {
          throw new AppError('First Name should contain alphabetic characters only', 400);
        }
      },
    },
    lastName : {
      type :      String,
      minLength : [3, 'Last name must be at least 3 characters'],
      maxLength : [15, 'Last name must be at less than 15 characters'],
      required :  [true, 'Last name is a required field'],
      trim :      true,
      match :     /^[A-Za-z]+$/,
      validate(value) {
        if (!value.match(/^[A-Za-z]+$/)) {
          throw new AppError('Last Name should contain alphabetic characters only', 400);
        }
      },
    },
    userName : {
      type :      String,
      minLength : [3, 'Username must be at least 3 characters'],
      maxLength : [30, 'Username must be at less than 30 characters'],
      required :  [true, 'Username is a required field'],
      trim :      true,
      unique :    true,
    },
    email : {
      type :     String,
      required : [true, 'Email is a required field'],
      unique :   true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new AppError('Invalid email', 400);
        }
      },
    },
    password : {
      type :      String,
      required :  [true, 'Password is a required field'],
      trim :      true,
      minlength : [6, 'Password must be at least 6 characters'],
      match :     /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/,

      //@iti43OS

      validate(value) {
        if (!value.match(/(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/)) {
          throw new AppError('Password must contain at least one number , Capital letter and one special character', 400);
        }
      },
    },
    nationalId : {
      type :     String,
      required : true,
      unique :   true,
      length :   14,
      match :    /^(2|3)\d{1,2}(0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(0[1-9]|1[0123456789]|2[12389]|3[012]|88)(\d{4})([0-9])$/,
      validate : {
        validator : function(value) {
          return /^(2|3)\d{1,2}(0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(0[1-9]|1[0123456789]|2[12389]|3[012]|88)(\d{4})([0-9])$/.test(value);
        },
        message : 'Please provide a valid Egyptian national ID number'
      }
    },
    DOB : {
      type :      Date,
      required :  [true, 'Date of Birth is a required field'],
        validator : function(birthDate) {
          const newyear = new Date(); 
          const userBirthdate = new Date(birthDate);
          const age = (newyear.getFullYear() - userBirthdate.getFullYear()) - 1;
          if(age < 18)
            throw new AppError('Employee must be at least 18 years old.', 400)
        },
    },
    gender : {
      type :     String,
      required : true,
      enum :     ['male', 'female']
    },
    academicQualifications : {
      college : {
        type :      String,
        required :  true,
        minLength : 2,
        maxLength : 60,
        match :     /^[A-Za-z\s]+$/,
        validate :  {
          validator : function (value) {
            if (!value.match(/^[A-Za-z\s]+$/)) {
              throw new AppError('College name cannot contain numbers', 400);
            }
          },
        }, 
      },
      degree : {
        type :     String,
        required : true,
        enum :     ['bachelor', 'master', 'doctoral', 'PhD'],
      },
      institution : {
        type :      String,
        required :  true,
        minlength : 2, 
        maxlength : 50,
        match :     /^[A-Za-z\s]+$/,
        validate :  {
          validator : function (value) {
            if (!value.match(/^[A-Za-z\s]+$/)) {
              throw new AppError('Institution cannot contain numbers', 400);
            }
          },
        },
      },
      year : {
        type :     Number,
        required : true,
        validate : {
          validator : function (value) {
            const currentYear = new Date().getFullYear();
            return value <= currentYear; 
          },
          message : 'Year must be a valid past year',
        },
      }
    },
    hireDate : {
      type :     Date,
      validate : {
        validator : function(value) {
          return value <= Date.now(); 
        },
        message : 'Hire date cannot be in the future'
      },
      default : Date.now,
    },
    position : {
      type :      String,
      required :  true,
      trim :      true,
      minlength : 2, 
      maxlength : 50,
      match :     /^[A-Za-z\s]+$/,
      validate :  {
        validator : function (value) {
          if (!value.match(/^[A-Za-z\s]+$/)) {
            throw new AppError('Position cannot contain numbers', 400);
          }
        },
      },  
    },
    jobType : {
      type :     String,
      required : true,
      enum :     ['full-time', 'part-time', 'contract', 'freelance'],
    },
    depId : {
      type :     Schema.Types.ObjectId,
      ref :      'Department',
      required : true
    },
    salary : {
      type :     Number,
      required : true,
      min :      3500,
      max :      200000
    },
    phoneNumber : {
      type :     String,
      required : true,
      trim :     true,
      match :    /^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/,
      validate : {
        validator : function (value) {
          if (!value.match(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)) {
            throw new AppError('Invalid Egyptian phone number', 400);
          }
        },
      }, 
    },
    address : {
      type :      String,
      minlength : [5, 'Address must be at least 5 characters'],
      maxLength : [150, 'Address must be at less than 150 characters'],
      match :     /[a-zA-Z]+/,
      validate :  {
        validator : function (value) {
          if (!value.match(/[a-zA-Z]+/)) {
            throw new AppError('Address must contain at least one alphabetic characters', 400);
          }
        },
      }, 
  },
    pImage : {
      type :    String,
      default : 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png',
    },
    role : {
      type :    String,
      enum :    ['ADMIN', 'USER'],
      default : 'USER',
    },
  },
  {
    timestamps : true,
  }
);
schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};


schema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcryptjs.hash(this.password, 10);
});

schema.methods.verifyPassword = function verifyPassword(pass) {
  return bcryptjs.compareSync(pass, this.password);
};
schema.plugin(mongoosePaginate);
const Employee = model('Employee', schema);

module.exports = Employee;

