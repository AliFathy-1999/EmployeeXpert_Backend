const Vacation = require('../DB/models/vacation');
const Attendance = require('../DB/models/attendance');
const Employee = require('../DB/models/employee');

const _ = require('lodash');

const getAllVacations = async (req, res) => {
  try {
    const page = req.query.page || 0;
    let limit = req.query.limit || 10;
    if(limit > 20){
      limit = 10;
    }
    else{
      limit = req.query.limit ;
    }
    const count = await Vacation.countDocuments({});

    const allVacations = await Vacation.find({}).sort({employeeId : 1}).skip(page * limit).limit(limit).populate({
      path :   'employeeId',
      select : 'firstName lastName  position phoneNumber',
    })
    .exec();

    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages - 1 ? page + 1 : null;
    const prevPage = page > 0 ? page - 1 : null;
    const paginationInfo = {
      totalCount : count,
      totalPages,
      nextPage :   nextPage ? `/vacations?page=${nextPage}` : null,
      prevPage :   prevPage ? `/vacations?page=${prevPage}` : null,
    };
    return res.status(200).json({allVacations, paginationInfo});
  } catch (error) {
    return res.status(500).json({ message : error.message });
  }
};

const getOneVacation = async (req, res) => {
  try {
    const { id } = req.params;
    const vacation = await Vacation.findById(id);
    res.status(200).json(vacation);
  } catch (error) {
    res.status(500).json({ message : error.message });
  }
};

const getOneVacationWithUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const vacation = await Vacation.findById(id)
      .populate({
        path :   'employeeId',
        select : 'firstName lastName nationalId position phoneNumber',
      })
      .exec();
    res.status(200).json(vacation);
  } catch (error) {

    res.status(500).json({ message : error.message });
  }
};

const getVacationWithemployeeId = async (req, res) => {
  try {
    const page = req.query.page || 0;
    let limit = req.query.limit || 10;
    if(limit > 20){
      limit = 10;
    }
    else{
      limit = req.query.limit ;
    }
    const count = await Vacation.countDocuments({});
    const { employeeId } = req.params;
    
    const vacations = await Vacation.find({ employeeId : employeeId }).skip(page * limit).limit(limit);
    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages - 1 ? page + 1 : null;
    const prevPage = page > 0 ? page - 1 : null;
    const paginationInfo = {
      totalCount : count,
      totalPages,
      nextPage :   nextPage ? `/vacations?page=${nextPage}` : null,
      prevPage :   prevPage ? `/vacations?page=${prevPage}` : null,
    };
    res.status(200).json({vacations, paginationInfo});
  } catch (error) {
    res.status(500).json({ message : error.message });
  }
};



const applyForVacation = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const empVacation = await Vacation.find({ employeeId : employeeId });
    let totalDaysSum;
    let newTotalDays;
    let TotalDays;
    const now = Date.now();
    const date = new Date(now);
    if (empVacation) {
      totalDaysSum = empVacation.reduce((sum, obj) => {
        return sum + obj.totalDays;
      }, 0);
    }
    // newTotalDays = totalDaysSum + req.body.totalDays;
    if (newTotalDays <= 21) {
      const vacation = new Vacation(req.body);

      // console.log(date);
      if (vacation.fromDay > date) {
        vacation.employeeId = employeeId;
        // TotalDays = totalDaysSum + req.body.totalDays;
        // vacation.totalDays = TotalDays;
        const Vacations = await vacation.save();
        return res.status(200).json(Vacations);
      } else {
        res.json({
          message : 'the start date of a vacation should be after today',
        });
      }
    } else {
      const maxDaysLimit = 22;
      const exceededDays = newTotalDays - maxDaysLimit;
      const vacation = new Vacation(req.body);
      if (vacation.fromDay > date) {
      vacation.employeeId = employeeId;
      // vacation.maxDays += exceededDays;
      const Vacations = await vacation.save();
      return res.status(200).json(Vacations);
      }else{
        res.json({
          message : 'the start date of a vacation should be after today',
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message : error.message });
  }
};

const updateVacationDaysinAttendence = async (employeeId, totalDays) => {
  const employee = await Employee.findById(employeeId);
  const attendance = await Attendance.updateMany({employee:employee._id} ,
    { BalanceVacations : totalDays }
  );
  return attendance;
}

// const modifyVacation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {employeeId} = req.body;
//     let totalDaysSum;
//     let newTotalDays;
//     let TotalDays;
//     const empVacation = await Vacation.find({ employeeId : employeeId });
//     console.log("empVacation",empVacation);
//     if (empVacation) {
//       // totalDaysSum = empVacation.reduce((empVacation[empVacation.length-1].totalDays, obj) => {
//       //   console.log("sum",sum);
//       //   // console.log("obj.totalDays",obj.totalDays);
//       //   return sum + obj.totalDays;
//       // }, 0);
//       const lastObjectIndex = empVacation.length - 1;
//       const lastObject = empVacation[lastObjectIndex];
//       console.log("lastObject",lastObject);
//       totalDaysSum = empVacation.map((obj, index) => {
//         if (index === lastObjectIndex) {
//              TotalDays = obj.totalDays + req.body.totalDays;
//         }
//         return TotalDays;
//       });
//   }
//     const vacation = await Vacation.findByIdAndUpdate(id);
//     console.log("vacation",vacation);
//     if (!vacation) {
//       return res
//         .status(404)
//         .json({ message : `can't find any vacation with ID ${id}` });
//     }
 
//     // totalDaysSum = vacation.totalDays

//     // console.log(totalDaysSum);

//     // newTotalDays = totalDaysSum + req.body.totalDays;
//     console.log("totalDaysSum",totalDaysSum);

//     console.log("newTotalDays",newTotalDays);
// console.log("totalDays",req.body.totalDays);
//     if (newTotalDays <= 21) {
//       if ( req.body.status === 'Accepted') {
//         TotalDays = totalDaysSum + req.body.totalDays;
//         vacation.totalDays = TotalDays;
//         vacation.status = req.body.status;
//         const Vacations = await vacation.save();
//         const updateAttendence = updateVacationDaysinAttendence(vacation.employeeId, vacation.totalDays);
//         await updateAttendence;
//         return res.status(200).json(Vacations);
//       } else if ( req.body.status === 'Declined' && newTotalDays > 0) {
//         TotalDays = totalDaysSum - req.body.totalDays;
//         vacation.totalDays = TotalDays;
//         vacation.status = req.body.status
//         const Vacations = await vacation.save();
//         return res.status(200).json(Vacations);
//       }
//     } else {
//       if ( req.body.status === 'Accepted') {
//       const maxDaysLimit = 21;
//       let exceededDays = newTotalDays - maxDaysLimit;
//       // console.log(newTotalDays);
//       if(exceededDays === 0){
//         exceededDays =1;
//       }
//       vacation.maxDays += exceededDays;
//       console.log(vacation.maxDays);
//       vacation.status = req.body.status;
//       const Vacations = await vacation.save();
//       return res.status(200).json(Vacations);
//       }
//       else if ( req.body.status === 'Declined' && newTotalDays !== 0){
//         console.log(newTotalDays);
//         const maxDaysLimit = 22;
//         const exceededDays = newTotalDays - maxDaysLimit;
//         vacation.maxDays -= exceededDays;
//         vacation.status = req.body.status

//         const Vacations = await vacation.save();
//         res.status(200).json(Vacations);
//       }
//     }
//     const updatedVacation = await Vacation.findById(id);
//     if(updatedVacation.status){

//     }
//     res.status(200).json(updatedVacation);
//   } catch (error) {
//     res.status(500).json({ message : error.message });
//   }
// };



// const modifyVacation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {employeeId} = req.body;
//     let totalDaysSum;
//     let newTotalDays;
//     let totalMaxDays;
//     // let TotalDays= true;
//     const empVacation = await Vacation.find({ employeeId : employeeId });
//     if (empVacation) {
//       const lastObjectIndex = empVacation.length - 1;
//       const lastObject = empVacation[lastObjectIndex];
//        totalDaysSum=0;
//       //  Vacation.maxDays += empVacation[lastObjectIndex-1];
//       // console.log(totalMaxDays);
//       for (let i = 0; i < empVacation.length; i++) {
//         totalDaysSum += empVacation[i].totalDays;
//         totalMaxDays = empVacation[i].maxDays;
//         console.log("maxDays",empVacation[i].maxDays);
//         console.log("Loop totalMaxDays", totalMaxDays);

//       }
//       console.log("first totalMaxDays", totalMaxDays);

//       console.log("lastObject", lastObject);
    
//       if (lastObject) {
//          newTotalDays = totalDaysSum + req.body.totalDays;
//          console.log("totalDaysSum",totalDaysSum);

//     console.log("newTotalDays",newTotalDays);
//     const vacation = await Vacation.findByIdAndUpdate(id);
//         console.log("vacation",vacation);
//         if (!vacation) {
//           return res
//             .status(404)
//             .json({ message : `can't find any vacation with ID ${id}` });
//         }
//         if (newTotalDays <= 21) {
//           if (req.body.status === "Accepted") {
//             lastObject.totalDays = newTotalDays;
//             vacation.status = req.body.status
//             const updatedVacation = await lastObject.save();
//             const updateAttendence = updateVacationDaysinAttendence(
//               updatedVacation.employeeId,
//               updatedVacation.totalDays
//             );
//             await updateAttendence;
//             return res.status(200).json(updatedVacation);
//           } else if (req.body.status === "Declined" && newTotalDays > 0) {
//             lastObject.totalDays = totalDaysSum;
//             const updatedVacation = await lastObject.save();
//             return res.status(200).json(updatedVacation);
//           }
//         } else {
// if (req.body.status === "Accepted") {
//   const maxDaysLimit = 21;
//   vacation.totalDays = 21;
//   let exceededDays; 
//   if (exceededDays === 0) {
//     exceededDays = 1;
//   }
//   if (vacation.maxDays === 22) {
//     // exceededDays = newTotalDays - maxDaysLimit;
//     exceededDays = totalMaxDays+req.body.totalDays-maxDaysLimit;
//     if(exceededDays < 22){
//       vacation.maxDays = exceededDays+22;
//     }
//     else{
//     vacation.maxDays = exceededDays;
//     }
//     console.log("totalMaxDays",totalMaxDays);
//   } else {
//     exceededDays = totalMaxDays+req.body.totalDays;
  
//     vacation.maxDays = exceededDays;

//     console.log("totalMaxDays",totalMaxDays);


//   }

//   // TotalDays
//   // console.log(lastObject.totalDays);
//   // let exceededDays = totalDaysSum;

//   console.log("exceededDays",exceededDays);
//   console.log("newTotalDays",newTotalDays);



//   vacation.status = req.body.status
//   // lastObject.maxDays += exceededDays;
//   console.log("vacation.maxDays",vacation.maxDays);
//   // console.log("lastObject.maxDays",lastObject.maxDays);
//   // lastObject.totalDays = newTotalDays;

//   // vacation.maxDays = lastObject.maxDays;

//   // Set the totalDays and maxDays fields in the Vacation document
//   // vacation.totalDays = newTotalDays;
//   // vacation.maxDays = lastObject.maxDays;

//   const updatedVacation = await vacation.save();
//   return res.status(200).json(updatedVacation);
// } else if (req.body.status === "Declined" && lastObject.totalDays !== 0) {
//   const maxDaysLimit = 21;
//   let exceededDays = newTotalDays - maxDaysLimit;
//   if (exceededDays < 0) {
//     lastObject.totalDays = totalDaysSum;
//   } else {
//     lastObject.maxDays -= exceededDays;
//     lastObject.totalDays = newTotalDays;
//   }

//   // Set the totalDays and maxDays fields in the Vacation document
//   vacation.totalDays = lastObject.totalDays;
//   vacation.maxDays = lastObject.maxDays;

//   const updatedVacation = await vacation.save();
//   return res.status(200).json(updatedVacation);
//           }
//         }
//       }
//       }

//     }catch (error) {
//     res.status(500).json({ message : error.message }); }
// };








const modifyVacationByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const now = Date.now();
    const date = new Date(now);

    const vacation = await Vacation.findById( id);
    if (!vacation) {
      return res
        .status(404)
        .json({ message : `can't find any vacation with ID ${id}` });
    }
    if (vacation.fromDay > date) {
      console.log(req.body);
      const updates = _.pick(req.body, ['reasonForVacation', 'fromDay', 'toDay', 'totalDays']);
      const result = await Vacation.updateOne({ _id: id }, updates);
     console.log(result);
      const updatedVacation = await Vacation.findById(id);
      res.status(200).json(updatedVacation);
  }else{
    res.json({
      message : 'the start date of a vacation should be after today',
    });
  }
  } catch (error) {
    res.status(500).json({ message : error.message });
  }
};

const removeVacation = async (req, res) => {
  try {
    const { id } = req.params;
    const vacation = await Vacation.findById(id);

    if (!vacation) {
      return res
        .status(404)
        .json({ message : `Can't find any vacation with ID ${id}` });
    }

    const now = Date.now();
    const date = new Date(now);

    if (vacation.status === 'Declined' || date < vacation.fromDay) {
      const deletedVacation = await Vacation.findByIdAndDelete(id, req.body);

      if (!deletedVacation) {
        return res
          .status(404)
          .json({ message : `Can't find any vacation with ID ${id}` });
      }

      return res.status(200).json({ message : 'Vacation deleted successfully' });
    } else {
      res.json({ message : 'Sorry, you can not cancel it' });
    }
  } catch (error) {
    // console.log(error.message);

    res.status(500).json({ message : error.message });
  }
};

const applyForVacationByAdmin = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const empVacation = await Vacation.find({ employeeId });
    let totalDaysSum;
    let newTotalDays;
    let TotalDays;
    let totalDaysMaxSum;
    let newTotalDaysMax;
    console.log("empVacation",empVacation);
    if (empVacation) {
      const lastObjectIndex = empVacation.length - 1;
      const lastObject = empVacation[lastObjectIndex];
      console.log("lastObject",lastObject);
      totalDaysSum=lastObject.totalDays
      console.log("totalDaysSum",totalDaysSum);
      totalDaysMaxSum=lastObject.maxDays;
      console.log("totalDaysMaxSum",totalDaysMaxSum);

      newTotalDays=totalDaysSum+req.body.totalDays;
      console.log("newTotalDays",newTotalDays);
      newTotalDaysMax=totalDaysMaxSum+req.body.totalDays;
      console.log("newTotalDays",newTotalDaysMax);
    }
    if (newTotalDays <= 21) {
      const vacation = new Vacation(req.body);
      const now = Date.now();
      const date = new Date(now);
      if (vacation.fromDay > date) {
        TotalDays = newTotalDays;
        vacation.totalDays=TotalDays;
        console.log("vacation.totalDays",vacation.totalDays);

  console.log("TotalDays",TotalDays);
  console.log(req.body);
        const Vacations = await vacation.save();
        const updateAttendence = updateVacationDaysinAttendence(vacation.employeeId, vacation.totalDays);
        await updateAttendence;
        return res.status(200).json(Vacations);
      } else {
        res.json({
          message : 'the start date of a vacation should be after today',
        });
      }
    } else {
      const maxDaysLimit = 22;
      const exceededDays = newTotalDaysMax - maxDaysLimit;
      console.log("exceededDays",exceededDays);
      console.log("newTotalDays",newTotalDaysMax);
      const vacation = new Vacation(req.body);
      vacation.totalDays=21;

      vacation.employeeId = employeeId;
      vacation.maxDays += exceededDays;

      console.log(req.body);

      const Vacations = await vacation.save();

      return res.status(200).json(Vacations);
    }
  } catch (error) {
    // console.log(error.message);

    return res.status(500).json({ message : error.message });
  }
};




// const modifyVacation = async (req, res) => {
//   try {
//     const{id} = req.params;
//     const { employeeId } = req.body;
//     const empVacation = await Vacation.find({ employeeId : employeeId });
//     let totalDaysSum;
//     let newTotalDays;
//     let TotalDays;
//     let totalDaysMaxSum;
//     let newTotalDaysMax;
//     console.log("empVacation",empVacation);
//     if (empVacation) {
//       const lastObjectIndex = empVacation.length - 1;
//       const lastObject = empVacation[lastObjectIndex];
//       console.log("lastObject",lastObject);
//       totalDaysSum=lastObject.totalDays
//       console.log("totalDaysSum",totalDaysSum);
//       totalDaysMaxSum=lastObject.maxDays;
//       console.log("totalDaysMaxSum",totalDaysMaxSum);

//       newTotalDays=totalDaysSum+req.body.totalDays;
//       console.log("newTotalDays",newTotalDays);
//       newTotalDaysMax=totalDaysMaxSum+req.body.totalDays;
//       console.log("newTotalDays",newTotalDaysMax);
//     }
//     const vacation = await Vacation.findByIdAndUpdate(id);
//     console.log("vacation",vacation);
//     if (!vacation) {
//       return res
//         .status(404)
//         .json({ message : `can't find any vacation with ID ${id}` });
//     }
//     if (newTotalDays <= 21) {
//       if(req.body.status === "Accepted")
//     {
//       TotalDays = newTotalDays;
//       vacation.totalDays=TotalDays;
//      vacation.status = req.body.status;
// const vacations=vacation.save()
//         console.log("vacation.totalDays",vacations.totalDays);

//   console.log("TotalDays",TotalDays);
       
//         const updateAttendence = updateVacationDaysinAttendence(vacation.employeeId, vacation.totalDays);
//         await updateAttendence;
//         return res.status(200).json(vacation);
      
//       } else {
//         res.json({
//           message : 'the start date of a vacation should be after today',
//         });
//       }
//     } else {
//       const maxDaysLimit = 22;
//       const exceededDays = newTotalDaysMax - maxDaysLimit;
//       console.log("exceededDays",exceededDays);
//       console.log("newTotalDays",newTotalDaysMax);
//       const vacation = new Vacation(req.body);
//       vacation.totalDays=21;

//       vacation.employeeId = employeeId;
//       vacation.maxDays += exceededDays;


//       const Vacations = await vacation.save();

//       return res.status(200).json(Vacations);
//     }
//   } catch (error) {
//     // console.log(error.message);

//     return res.status(500).json({ message : error.message });
//   }
// };



// const applyForVacationByAdmin = async (req, res) => {
//   try {
//     const { employeeId } = req.body;
//     const empVacation = await Vacation.find({ employeeId });
//     let totalDaysSum;
//     let newTotalDays;
//     let TotalDays;
//     if (empVacation) {
//       totalDaysSum = empVacation.reduce((sum, obj) => {
//         console.log("sum",sum);
//         console.log("obj.totalDays",obj.totalDays);
//         return sum + obj.totalDays;

//       }, 0);
//     }
//     // newTotalDays = totalDaysSum;
// newTotalDays = totalDaysSum + req.body.totalDays;
// console.log("newTotalDays",newTotalDays);
// console.log("totalDaysSum",totalDaysSum);
//     if (newTotalDays <= 21) {
//       const vacation = new Vacation(req.body);
//       const now = Date.now();
//       const date = new Date(now);
//       if (vacation.fromDay > date) {
//         // TotalDays = newTotalDays;
//         TotalDays=newTotalDays;
//         console.log("TotalDays",TotalDays);
//         vacation.totalDays = TotalDays;
//         const Vacations = await vacation.save();
//         const updateAttendence = updateVacationDaysinAttendence(vacation.employeeId, vacation.totalDays);
//         await updateAttendence;
//         // console.log(newTotalDays);
//         // console.log(TotalDays);

//         return res.status(200).json(Vacations);
//       } else {
//         res.json({
//           message : 'the start date of a vacation should be after today',
//         });
//       }
//     } else {
//       const maxDaysLimit = 22;
//       const exceededDays = newTotalDays - maxDaysLimit;
//       const vacation = new Vacation(req.body);
//       vacation.employeeId = employeeId;
//       vacation.maxDays += exceededDays;


//       const Vacations = await vacation.save();

//       return res.status(200).json(Vacations);
//     }
//   } catch (error) {
//     // console.log(error.message);

//     return res.status(500).json({ message : error.message });
//   }
// };


// const applyForVacationByAdmin = async (req, res) => {
//   try {
//     const { employeeId } = req.body;
//     const empVacation = await Vacation.find({ employeeId });
//     let totalDaysSum = 0;
//     let maxDaysSum = 0;

//     if (empVacation && empVacation.length > 0) {
//       totalDaysSum = empVacation.reduce((sum, obj) => sum + obj.totalDays, 0);
//       maxDaysSum = empVacation.reduce((sum, obj) => sum + obj.maxDays, 0);
//     }

//     const newTotalDays = totalDaysSum + req.body.totalDays;
//     const newMaxDays = maxDaysSum + req.body.maxDays;

//     let totalDays = req.body.totalDays;
//     let maxDays = req.body.maxDays;

//     if (newTotalDays > 21) {
//       totalDays = 21 - totalDaysSum;
//       maxDays = newTotalDays - 21;
//     }

//     const vacation = new Vacation({
//       employeeId,
//       reasonForVacation:req.body.reasonForVacation,
//       fromDay: req.body.fromDay,
//       toDay: req.body.toDay,
//       totalDays,
//       maxDays,
//       status: req.body.status,
//     });

//     const now = Date.now();
//     const date = new Date(now);

//     if (vacation.fromDay > date) {
//       const savedVacation = await vacation.save();
//       const updateAttendence = updateVacationDaysinAttendence(employeeId, savedVacation.totalDays);
//       await updateAttendence;

//       return res.status(200).json(savedVacation);
//     } else {
//       return res.json({
//         message: 'The start date of a vacation should be after today',
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({ message : error.message });
//   }
// };

module.exports = {
  getAllVacations,
  getOneVacation,
  applyForVacation,
  // modifyVacation,
  removeVacation,
  getOneVacationWithUserData,
  getVacationWithemployeeId,
  applyForVacationByAdmin,
  modifyVacationByUser
};
