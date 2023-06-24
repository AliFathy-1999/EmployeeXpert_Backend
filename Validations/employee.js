const Joi = require('joi');

const signUp = {
    body : Joi.object().keys({
        firstName : Joi.string().trim().regex(/^[a-zA-Z]+$/).min(3).max(15)
        .messages({
            'string.min' : 'First name must be at least 3 characters',
            'string.max' : 'First name must be at most 15 characters',
        }),
        lastName : Joi.string().trim().regex(/^[a-zA-Z]+$/).min(3).max(15)
        .messages({
            'string.min' : 'Last name must be at least 3 characters',
            'string.max' : 'Last name must be at most 15 characters',
        }),
        DOB : Joi.date()
        .required()
        .messages({
          'date.base' :   'Date of Birth is a required field',
          'date.format' : 'Date of Birth must be a valid date',
          'date.custom' : 'Date of birth is invalid, Employee must be at least 16 years old'
        })
        .custom((value) => {
          if (new Date(value).getFullYear() > 2007) {
            throw new Error('Date of birth is invalid, Employee must be at least 16 years old');
          }
          return true;
        }), 
    email : Joi.string().email() 
        .messages({
            'string.email' : 'Invalid email format',
        }),
        userName : Joi.string().trim().regex(/^[a-zA-Z0-9]+$/).min(3).max(30)
        .messages({
            'string.min' : 'Username must be at least 3 characters',
            'string.max' : 'Username must be at most 30 characters',
        }),       
        password : Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/).messages({
            'string.min' :          'Password must be at least 8 characters',
            'string.pattern.base' : 'Password must contain at least one number , Capital letter and one special character',
        }), 
        nationalId : Joi.string().length(14)
        .pattern(/^(2|3)\d{1,2}(0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(0[1-9]|1[0123456789]|2[12389]|3[012]|88)(\d{4})([0-9])$/)
        .messages({
            'string.length' :       'Invalid National ID',            
            'string.pattern.base' : 'Invalid National ID, Please provide a valid Egyptian national ID number',
        }),
        gender :                 Joi.string().valid('male', 'female'),
        academicQualifications : Joi.object({
            college : Joi.string().min(2).max(60).pattern(/^[A-Za-z\s]+$/).messages({
              'string.min' :          'College name must be at least 2 characters',
              'string.max' :          'College name must be less than 60 characters',
              'string.pattern.base' : 'College name cannot contain numbers',
            }),
            degree :      Joi.string().valid('bachelor', 'master', 'doctoral'),
            institution : Joi.string().min(2).max(50).pattern(/^[A-Za-z\s]+$/).messages({
              'string.min' :          'Institution name must be at least 2 characters',
              'string.max' :          'Institution name must be less than 50 characters',
              'string.empty' :        'Institution name is a required field',
              'string.pattern.base' : 'Institution name cannot contain numbers',
            }),
            year : Joi.number().max(new Date().getFullYear()).messages({
              'number.base' : 'Year must be a valid number',
              'number.max' :  'Year must be a valid past year',
            }),
          }),
          hireDate : Joi.date().max('now').default(Date.now),
          position : Joi.string().min(2).max(50).pattern(/^[A-Za-z\s]+$/).messages({
            'string.min' :          'Position must be at least 2 characters',
            'string.max' :          'Position must be less than 50 characters',
            'string.empty' :        'Position is a required field',
            'string.pattern.base' : 'Position cannot contain numbers',
          }),
          jobType :     Joi.string().valid('full-time', 'part-time', 'contract', 'freelance'),
          depId :       Joi.string(),
          salary :      Joi.number().min(0),
          phoneNumber : Joi.string().pattern(/^01([0125]{2}|15)[0-9]{8}$/)
          .messages({
            'string.pattern.base' : 'Invalid Egyptian phone number',
          }),
          address : Joi.string().trim().regex(/[a-zA-Z]+/).min(5).max(150)
          .messages({
              'string.min' :          'Username must be at least 3 characters',
              'string.max' :          'Username must be at most 30 characters',
              'string.pattern.base' : 'Address must contain at least one alphabetic characters',
          }),    
          role : Joi.string().valid('ADMIN', 'USER').default('USER'),
    }),  
}

const signIn = {
    body : Joi.object().keys({
        userName : Joi.string().trim(),
        password : Joi.string().trim(),
    }),
};

const checkvalidID = {
  params : Joi.object().keys({
      id : Joi.string().pattern(/^[0-9a-fA-F]{24}$/).length(24).messages({
        'string.empty' :        'Invalid ID',
        'string.pattern.base' : 'Invalid ObjectID',
      }), 
  })
};

module.exports = {
    signUp,
    signIn,
    checkvalidID
};
