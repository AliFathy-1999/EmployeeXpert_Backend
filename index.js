require('dotenv').config();
const app = require('./app.js');
const port = process.env.PORT || 4000;
const payrollJob = require('./payrollJob.js');



payrollJob();


app.listen(port, () => {
  console.log(`Server Running here 👉 http://localhost:${port}`);
});
