const schedule = require('node-schedule');
const Excuse = require("../DB/models/Excuse");
const leaveReport = require ('../DB/models/leaveReport');

module.exports = function() {
    schedule.scheduleJob('0 0 1 * *', async function() {
      try {
        const leaveReportDoc = await Excuse.find({typeOfExcuse:'Leave Early'});
        const leave = await leaveReport.insertMany(leaveReportDoc);
        const result = await Excuse.deleteMany({});
        console.log("Excuse Reset");
        return result, leave;
      } catch (error) {
        console.error(error);
      }
    });
  };
  