const schedule = require('node-schedule');
const Vacation = require('../DB/models/vacation');

// scheduleJob('0 0 0 1 * *', async () => {
//   try {
//     await Vacation.deleteMany({});
//     console.log('Values deleted at the start of the month');
//   } catch (error) {
//     console.error(error);
//   }
// });



function scheduleVacationJob() {
  schedule.scheduleJob('0 0 21 * * *', async () => {
    try {
      await Vacation.deleteMany({});
      console.log('Values deleted at the start of the month');
      console.log('hi from schedule');
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