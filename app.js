require("dotenv").config();
const express = require("express");
const { AppError } = require("./lib");
const cron = require("node-cron");
const MongoClient = require("mongodb").MongoClient;
const handleResponseError = require("./lib/handlingErrors");
const bodyParser = require('body-parser');

const app = express();
const cors = require("cors");

const cookieParser = require('cookie-parser');
const routes = require('./routes/index.js');
require('./DB/connects');
const resetPayroll = require('./scheduledJobs/resetPayroll');
const scheduleVacationJob = require('./scheduledJobs/vacationSchedule');
const excuseSchedule = require('./scheduledJobs/excuseSchedule');


const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/", routes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

resetPayroll();
scheduleVacationJob();
excuseSchedule();
async function resetField() {
  try {
    const collectionName = "attendances";
    const client = await MongoClient.connect(process.env.DB);
    const db = client.db();
    const collection = db.collection(collectionName);

    // Perform the update operation to reset the field
    await collection.updateMany(
      {},
      { $set: { deduction: 0, lateExcuse: 0, lateCounter: 0 } }
    );

    console.log("Field reset successful");
    client.close();
  } catch (error) {
    console.error("Error resetting field:", error);
  }
}

cron.schedule("0 0 1 * *", () => {
  resetField();
});

app.use(handleResponseError);

module.exports = app;
