const express = require('express');
const { asycnWrapper, AppError } = require('../lib/index');
// const {getAllEmployeesLeaves} = require('../controllers/leaveReport');
const leaveReportController = require('../controllers/leaveReport');
const {adminAuth} = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const router = express.Router();

// router.get('/all' , adminAuth , async(req,res,next) =>{
//     const {page , limit} = req.query;
//     const paginatedLeaveReport = leaveReportController.getAllEmployeesLeaves();
//     // const [err , data] = await asycnWrapper(paginatedLeaveReport);
//     // if(err) return next(err);
//     res.status(200).json({status : 'success' , data : paginatedLeaveReport})
//   })


router.get('/all', adminAuth, async (req, res, next) => {
  const { page, limit } = req.query
  const getEarlyLeave = leaveReportController.getEarlyLeave(page, limit);
  const [err, data] = await asycnWrapper(getEarlyLeave);
  if (err) return next(err);
  res.status(200).json({ status : 'success', data });
      });


// router.get('/all', adminAuth, async (req, res, next) => {
//     const { page, limit } = req.query;
//     const employeeLeaves = await leaveReportController.getAllEmployeesLeaves();
  
//     if (Array.isArray(employeeLeaves)) {
//       employeeLeaves.forEach(async (employeeLeave) => {
//         if (employeeLeave && employeeLeave.excuses && Array.isArray(employeeLeave.excuses)) {
//           const excuseIds = employeeLeave.excuses.map((excuse) => excuse._id.toString());
//           const excuses = await leaveReportController.getAllExcusesByIds(excuseIds, employeeLeave.userId);
  
//           employeeLeave.excuses = {};
  
//           Object.values(employeeLeave.excuses).forEach((excuse) => {
//             const excuseId = excuse._id.toString();
//             const relatedExcuse = excuses.find((excuse) => excuse._id.toString() === excuseId);
//             if (relatedExcuse) {
//               employeeLeave.excuses[excuseId] = relatedExcuse;
//             }
//           });
//         }
//       });
//     }
  
//     res.status(200).json({ status: "success", data: employeeLeaves });
//   });

// router.get('/all', adminAuth, async (req, res, next) => {
//     const { page, limit } = req.query;
//     const employeeLeaves = await leaveReportController.getAllEmployeesLeaves();
  
//     if (Array.isArray(employeeLeaves)) {
//       employeeLeaves.forEach(async (employeeLeave) => {
//         // create an empty 'excuses' object for each employeeLeave object
//         employeeLeave.excuses = {};
  
//         const excuseIds = Object.keys(employeeLeave.excuses);
//         const excuses = await leaveReportController.getAllExcusesByIds(excuseIds, employeeLeave.userId);
  
//         Object.values(employeeLeave.excuses).forEach((excuse) => {
//           const excuseId = excuse._id.toString();
//           const relatedExcuse = excuses.find(
//             (excuse) => excuse._id.toString() === excuseId
//           );
//           // check if the excuse is related to the employeeLeave object
//           if (relatedExcuse) {
//             // add the excuse object to the 'excuses' object of the employeeLeave object
//             employeeLeave.excuses[excuseId] = relatedExcuse;
//           }
//         });
//       });
//     }
  
//     res.status(200).json({ status: "success", data: employeeLeaves });
//   });


// router.get('/all', adminAuth, async (req, res, next) => {
//     const { page, limit } = req.query;
//     const employeeLeaves = await leaveReportController.getAllEmployeesLeaves();
  
//     if (Array.isArray(employeeLeaves)) {
//       employeeLeaves.forEach(async (employeeLeave) => {
//         // create an empty 'excuses' object for each employeeLeave object
//         employeeLeave.excuses = [];
  
//         const excuseIds = employeeLeave.excuses.map(
//           (excuse) => excuse._id.toString()
//         );
//         const excuses = await leaveReportController.getAllExcusesByIds(excuseIds, employeeLeave.userId);
  
//         excuseIds.forEach((excuseId) => {
//           const excuse = excuses.find(
//             (excuse) => excuse._id.toString() === excuseId
//           );
//           // check if the excuse is related to the employeeLeave object
//           if (excuse) {
//             // add the excuse object to the 'excuses' object of the employeeLeave object
//             employeeLeave.excuses[excuseId] = excuse;
//           }
//         });
//       });
//     }
  
//     res.status(200).json({ status: "success", data: employeeLeaves });
//   });
// router.get('/all',adminAuth,getAllEmployeesLeaves);


module.exports=router