let mongoose, { Schema, model } = require('mongoose');
const excuse = new Schema({

employeeId : {
        type :     Schema.Types.ObjectId,
        ref :      'Employee',
        required : true
    },
reason : {
    type :      String,
    required :  [true, 'Reason for this Lateness is required'],
    trim :      true,
    minLength : [5, 'Reason must be at least 5 characters'],
    maxLength : [200, 'Reason must be less than  200 characters'],
},
day : {
   type :    Date,
   default : new Date(Date.now() + 24 * 60 * 60 * 1000),
},
from : {
    type :     Date,
    default :  new Date().setHours(9, 0),
    required : [true, 'Start hour of Lateness is required'],
    // validate: {
    //     validator: function(value) {
    //       console.log('from:', value);
    //       console.log('to:', this.to);
    //       return new Date(value).getHours() < new Date(this.to).getHours();
    //     },
    //     message: 'Start hour must be before end hour'
    //   }
},
to : {
    type :     Date,
    default :  new Date().setHours(10, 0),
    required : [true, 'End hour is required'],
    max :      new Date().setHours(18, 0),
    // validate: {
    //   validator: function(value) {
    //     console.log('from:', value);
    //     console.log('to:', this.to);
    //     return new Date(value).getTime() > new Date(this.from).getTime();
    //   },
    //   message: 'End hour must be after start hour'
    // }
},
respond : {
    type :    String,
    enum :    ['Pending', 'Accepted', 'Rejected'],
    default : 'Pending'
},
noOfExcuses : {
type :    Number,
min :     0,
default : 0,
},

typeOfExcuse : {
    type :     String,
    enum :     ['Late', 'Leave Early'],
    required : true
}

});
excuse.pre('save', function(next) {
    if (this.reason) {
      this.reason = this.reason.trim();
    }
    next();
  });
const Excuse = model('Excuse', excuse);

module.exports = Excuse;