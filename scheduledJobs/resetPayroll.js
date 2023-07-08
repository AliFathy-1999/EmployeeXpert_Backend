const schedule = require('node-schedule');
const Payroll = require("../DB/models/payroll");
const payrollHistory = require ('../DB/models/payrollHistory');

module.exports = function() {
  schedule.scheduleJob('0 0 1 * *', async function() {
    try {
      const payrollHistoryDoc = await Payroll.find({});
      const payroll = await payrollHistory.insertMany(payrollHistoryDoc);
      const result = await Payroll.updateMany({}, { $set: { bonus: 0, deduction: 0 } });
      console.log("Payroll Reset");
      return result,payroll;
    } catch (error) {
      console.error(error);
    }
  });
};

// schedule.scheduleJob('0 0 8 * *', async function() {
//   try {
//     const payrollStream = Payroll.find({}).stream();
//     const payrollHistoryDocuments = [];

//     payrollStream.on('data', function (doc) {
//       payrollHistoryDocuments.push({ /* create a new document with data from doc */ });
//     });

//     payrollStream.on('end', async function () {
//       const payroll = await payrollHistory.insertMany(payrollHistoryDocuments);
//       const result = await Payroll.updateMany({}, { $set: { bonus: 0, deduction: 0 } });
//       console.log("Payroll Reset");
//       console.log(`Inserted ${payroll.length} documents into payrollHistory`);
//       return result,payroll;
//     });

//     payrollStream.on('error', function (err) {
//       console.error(err);
//     });
//   } catch (error) {
//     console.error(error);
//   }

// module.exports = function() {
//   schedule.scheduleJob('*/3 * * * *', async function() {
//     try {
//       const result = await Payroll.updateMany({}, { $set: { bonus: 0, deduction: 0 } });
//       console.log('Reset documents');
//       return result;
//     } catch (error) {
//       console.error(error);
//     }
//   });
// };
