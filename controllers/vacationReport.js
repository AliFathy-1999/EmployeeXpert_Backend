/* eslint-disable no-console */
const Vacation = require('../DB/models/vacation');
const Employee = require('../DB/models/employee');
const VacationReport = require('../DB/models/vacationReport');

// const addingDataToReport = async(req, res)=>{
//     const vacationReport = new VacationReport(req.body);
      
//       try {
//         const newVacationReport = await vacationReport.save();
//         console.log(newVacationReport);
//         res.status(200).json({status : 'success', newVacationReport})
//       } catch (err) {
//         console.error(err);
//       }
// }

const getVacationReport = async (req, res) => {
    try {
      const vacationReports = await VacationReport.find({}).populate({
        path :   'employeeId',
        select : 'pImage userName firstName lastName',
      }).populate({
        path :   'vacationId',
        select : 'totalDays maxDays',
      });
    const employeeVacations = {};
    vacationReports.forEach((report) => {
      const { employeeId, vacationId } = report;
      const { pImage, userName, firstName, lastName } = employeeId;
      const { totalDays, maxDays } = vacationId;

      if (!employeeVacations[userName]) {
        employeeVacations[userName] = {
            pImage,
          userName,
          firstName,
          lastName,
          vacations : []
        };
      }

      employeeVacations[userName].vacations.push({ totalDays, maxDays });
    });

    const reportData = Object.values(employeeVacations);

    return res.status(200).json(reportData);

    } catch (error) {
      res.status(500).json({ message : error.message });
    }
  };

  const getEmployeeVacationReport = async (req, res) => {
    try {
        const {employeeId} = req.user._id;
        const vacationReports = await VacationReport.find(employeeId).populate({
        path :   'employeeId',
        select : 'pImage userName firstName lastName',
      }).populate({
        path :   'vacationId',
        select : 'totalDays maxDays',
      });
      console.log(employeeId);
      console.log(vacationReports);

      return res.status(200).json(vacationReports);
    } catch (error) {
      res.status(500).json({ message : error.message });
    }
  };

  module.exports = {getVacationReport, getEmployeeVacationReport}