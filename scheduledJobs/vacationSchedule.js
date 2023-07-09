/* eslint-disable no-console */
const schedule = require('node-schedule');
const Vacation = require('../DB/models/vacation');
const vacationReport = require('../DB/models/vacationReport')
// scheduleJob('0 0 0 1 * *', async () => {
//   try {
//     await Vacation.deleteMany({});
//     console.log('Values deleted at the start of the month');
//   } catch (error) {
//     console.error(error);
//   }
// });



function scheduleVacationJob() {
  schedule.scheduleJob('0 0 1 1 *', async () => {
    try {
      const vacationReportDoc = await Vacation.find({});
      const vacation = await vacationReport.insertMany(vacationReportDoc);
      const result = await Vacation.deleteMany({});
      console.log('Values deleted at the start of the month');
      console.log('hi from schedule');
      return vacation , result;
    } catch (error) {
      console.error(error);
    }
  });
}


// schedule.scheduleJob('0 21 2 0 * *', async () => {
//   try {
//     await Vacation.deleteMany({});
//     console.log('Values deleted at the start of the month');
//   } catch (error) {
//     console.error(error);
//   }
// });

// schedule.scheduleJob('0 0 21 * * *', async()=>{
//     try {
//     await Vacation.deleteMany({}).save();
//     console.log('Values deleted at the start of the month');
//     console.log('hi from schedule');
//   } catch (error) {
//     console.error(error);
//   }
// })


module.exports = scheduleVacationJob;