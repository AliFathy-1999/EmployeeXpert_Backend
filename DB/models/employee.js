let mongoose, { Schema, model } = require('mongoose');
const { AppError } = require('../../lib');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const schema = new Schema(
  {
    firstName: {
      type: String,
      minLength: [3, 'First name must be at least 3 characters'],
      maxLength: [15, 'First name must be at less than 15 characters'],
      required: [true, 'First name is a required field'],
      trim: true,
      validate: {
        validator: function(value) {
          return /^[A-Za-z]+$/.test(value);
        },
        message: 'Name should contain alphabetic characters only'
      }
    },
    lastName: {
      type: String,
      minLength: [3, 'Last name must be at least 3 characters'],
      maxLength: [15, 'Last name must be at less than 15 characters'],
      required: [true, 'Last name is a required field'],
      trim: true,
      validate: {
        validator: function(value) {
          return /^[A-Za-z]+$/.test(value);
        },
        message: 'Name should contain alphabetic characters only'
      }
    },
    userName: {
      type: String,
      minLength: [3, 'Username must be at least 3 characters'],
      maxLength: [30, 'Username must be at less than 30 characters'],
      required: [true, 'Username is a required field'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is a required field'],
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new AppError('Invalid email',400);
        }
      },
    },
    password: {
      type: String,
      required: [true, 'Password is a required field'],
      trim: true,
      minlength: [6, 'Password must be at least 6 characters'],
      match: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/,
      //@iti43OS
      validate(value) {
        if (!value.match(/(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/)) {
          throw new AppError('Password must contain at least one number , Capital letter and one special character' , 400);
        }
      },
    },
    nationalId: {
      type: String,
      required: true,
      unique: true,
      maxLength:14,
      validate: {
        validator: function(value) {
          return /^[1-2]\d{13}$/.test(value);
        },
        message: 'Please provide a valid Egyptian national ID number'
      }
    },
    gender:{
      type: String,
      required: true,
      enum: ['male', 'female']
    },
    academicQualifications: {
      degree: {
        type: String,
        required: true
      },
      institution: {
        type: String,
        required: true
      },
      year: {
        type: Number,
        required: true
      }
    },
    hireDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return value <= Date.now(); 
        },
        message: 'Hire date cannot be in the future'
      },
      default: Date.now,
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    jobType:{
      type: String,
      required: true,
      enum: ['full-time', 'part-time', 'contract', 'freelance'],
    },
    depId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },
    salary: {
      type: Number,
      required: true,
      min: 0
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(value) {
          
          return /^\d{11}$/.test(value);
        },
        message: 'Please provide a valid 11-digit phone number'
      }
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true
      },
      city: {
        type: String,
        required: true,
        trim: true
      },
  },
    pImage: {
      type: String,
      default: 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png',
    },
    role: {
      type: String,
      enum: ['ADMIN','USER'],
      default: 'USER',
    },
  },
  {
    timestamps: true,
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

const Employee = model('Employee', schema);

module.exports = Employee;
