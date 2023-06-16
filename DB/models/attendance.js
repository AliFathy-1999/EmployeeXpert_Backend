// let mongoose, { Schema, model } = require('mongoose');
// const { AppError } = require('../../lib');
// const validator = require('validator');
// const bcryptjs = require('bcryptjs');

// const AttendanceSchema = new Schema(
//     {
//     employee: { 
//         type: Schema.Types.ObjectId,
//          ref: 'Employee',
//          required: true 
//         },
  
//     clockIn_Out: [
//         {  
//             checkInTimestamp: {
//               type: Date,
//               required: true
//             },  
//             checkOutTimestamp: {
//               type: Date,
//               required: true
//             }, 
//     }       
//     ],
//     workingDays: [
//         {  
//           date: {
//             type: Date,
//             required: true 
//           },  
//           clockInTime: Date,
//           clockOutTime: Date,
//           lateArrival: {
//             type: Boolean,
//             default: false  
//           }       
//         }         
//       ]

//   });
  
// const Attendance = model('Attendance',AttendanceSchema);
// module.exports = Attendance;