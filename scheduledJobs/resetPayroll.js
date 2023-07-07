const schedule = require('node-schedule');
const Payroll = require("../DB/models/payroll");


module.exports = function() {
  schedule.scheduleJob('0 0 7 * *', async function() {
    try {
      const result = await Payroll.updateMany({}, { $set: { bonus: 0, deduction: 0 } });
      console.log("Payroll Reset");
      return result;
    } catch (error) {
      console.error(error);
    }
  });
};

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
