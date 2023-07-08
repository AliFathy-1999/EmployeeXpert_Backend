const LeaveReport = require('../DB/models/leaveReport');
const Employee = require('../DB/models/employee')
const Excuse = require('../DB/models/Excuse')


// const getAllEmployeesLeaves = async () => {
//     try {
//       const employees = await Employee.find({});
  
//       const leaveReports = await LeaveReport.find({})
//       .populate({
//         path: "employeeId",
//         select: "userName position pImage depId",
//         populate: { path: "depId", select: "name" },
//       })
//         .populate({
//           path: "excuseId",
//           select: "noOfExcuses day employeeId",
//         });
  
//       const excuses = await Excuse.find({});
  
//       const employeeExcuses = {};
  
//       excuses.forEach((excuse) => {
//         const employeeId = excuse.employeeId;
  
//         if (!employeeExcuses[employeeId]) {
//           employeeExcuses[employeeId] = [];
//         }
  
//         employeeExcuses[employeeId].push({
//           _id: excuse._id,
//           noOfExcuse: excuse.noOfExcuses,
//           day: excuse.day,
//         });
//       });
//         const totalLeaves=24;
//         // const remainigLeaves = totalLeaves-excuses.noOfExcuses;
//         return employees.map((employee) => {
//         const employeeId = employee._id;
//         return {
//           userId: employeeId,
//           userName: employee.userName,
//           position: employee.position,
//           pImage: employee.pImage,
//           department: { _id: employee.depId._id, name: employee.depId.name },
//           excuses: employeeExcuses[employeeId] || [],
//           totalLeaves:totalLeaves,
//         //   remainigLeaves:remainigLeaves
//         };
//       });
//     //   const savedLeaveReports = await LeaveReport.insertMany(leaveReportsToSave);
  
//     //   return savedLeaveReports;
//     } catch (err) {
//       console.error(err);
//       throw new Error("Error getting employee leaves");
//     }
//   };


  // const getAllExcusesByIds = async (excuseIds, employeeId) => {
  //   try {
  //     const excuses = await Excuse.find({
  //       _id: { $in: excuseIds },
  //       employeeId: employeeId,
  //     });
  //     return excuses;
  //   } catch (err) {
  //     throw new Error(`Error retrieving excuses: ${err.message}`);
  //   }
  // };


  const getEarlyLeave = async (page , limit) =>{
    if(!page) page = 10;
    if(!limit) limit = 1;
    
    const options = {
      page: page,
      limit: limit,
      populate: {
        path: "employeeId",
        select: "firstName lastName position",
      },
    }; 
    
    const earlyLeave = await LeaveReport.paginate({},options)
    return earlyLeave;
    }  

module.exports = {
  getEarlyLeave
};
