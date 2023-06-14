const express = require('express');
const { AppError } = require('./lib');

const handleResponseError  = require('./lib/handlingErrors');
const app = express();
const cors = require('cors');

const cookieParser = require("cookie-parser");
const routes = require('./routes/index.js');
require('./DB/connects');

const corsOptions = {
  origin: "http://localhost:3000",
  credentials:true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/',routes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(handleResponseError);

module.exports = app;
