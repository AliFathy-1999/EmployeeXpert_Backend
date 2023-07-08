/* eslint-disable no-console */
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

// const getOneVacation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const vacation = await Vacation.findById(id);
//     res.status(200).json(vacation);
//   } catch (error) {
//     res.status(500).json({ message : error.message });
//   }
// };

// const getOneVacationWithUserData = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const vacation = await Vacation.findById(id)
//       .populate({
//         path :   'employeeId',
//         select : 'firstName lastName nationalId position phoneNumber',
//       })
//       .exec();
//     res.status(200).json(vacation);
//   } catch (error) {

//     res.status(500).json({ message : error.message });
//   }
// };

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
    const employeeId = req.user._id;
    
    const vacations = await Vacation.find({ employeeId : employeeId }).skip(page * limit).limit(limit);
    console.log(req.user._id)
    console.log('employeeId', employeeId);
    console.log('vacations', vacations);

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


const applyForVacation = async(req,res)=>{
  try{
    const employeeId = req.user._id;
    const empVacation = await Vacation.find({ employeeId : employeeId });
    const empHireDate = await Employee.find({ _id : employeeId });
console.log("empHireDate",empHireDate);
const currentYear = new Date().getFullYear();
const hireDate = empHireDate[0].hireDate.getFullYear()
const dOB = empHireDate[0].DOB.getFullYear();

const noOfYears = currentYear - hireDate ;
const age = currentYear - dOB ;

console.log("currentYear",currentYear);
console.log("hireDate",hireDate);

console.log("noOfYears",noOfYears);
console.log("age",age);

    let totalDaysSum;
    let newTotalDays;
    let TotalDays;
    let totalDaysMaxSum;
    let newTotalDaysMax;
    let lastObject;
    const now = Date.now();
    const today = new Date(now);
    const tomorrow = new Date(now);
    tomorrow.setDate(today.getDate() + 1);
    
    console.log('empVacation', empVacation);
    if (empVacation.length > 0) {
      const lastObjectIndex = empVacation.length - 1;
       lastObject = empVacation[lastObjectIndex];
      console.log('lastObject', lastObject);
      totalDaysSum = lastObject.totalDays
      console.log('totalDaysSum', totalDaysSum);
      totalDaysMaxSum = lastObject.maxDays;
      console.log('totalDaysMaxSum', totalDaysMaxSum);

      newTotalDays = totalDaysSum + req.body.totalDays;
      console.log('newTotalDays', newTotalDays);
      newTotalDaysMax = totalDaysMaxSum + req.body.totalDays;
      console.log('newTotalDays', newTotalDaysMax);
    }
if(noOfYears<10){
  if (newTotalDays <= 21) {
    const diffInDays = Math.ceil((new Date(req.body.toDay).getTime() - new Date(req.body.fromDay).getTime()) / (1000 * 60 * 60 * 24));
    console.log(diffInDays);
    if(new Date(req.body.fromDay) > today && diffInDays === req.body.totalDays){
      vacation.employeeId = employeeId;

      const vacation = new Vacation(req.body);

      console.log(req.body);


      const Vacations = await vacation.save();

      return res.status(200).json(Vacations);
            
    }else{
      res.json({message : 'start date must start from tomorrow date or total days must equal the difference between the start day and the end day'})}
  }else {
    const maxDaysLimit = 22;
    const exceededDays = newTotalDaysMax - maxDaysLimit;
    console.log('exceededDays', exceededDays);
    console.log('newTotalDays', newTotalDaysMax);
    const diffInDays = Math.ceil((new Date(req.body.toDay).getTime() - new Date(req.body.fromDay).getTime()) / (1000 * 60 * 60 * 24));
    if(new Date(req.body.fromDay) > today && diffInDays === req.body.totalDays){
    const vacation = new Vacation(req.body);
    vacation.totalDays = 21;
    vacation.employeeId = employeeId;

    // vacation.maxDays += exceededDays;

    console.log(req.body);

    
      const Vacations = await vacation.save();

      return res.status(200).json(Vacations);
    
    }
    else{
      res.json({message : 'start date must start from tomorrow date or total days must equal the difference between the start day and the end day'})
    }
  }

}
else if(noOfYears >=10){
  if (newTotalDays <= 30) {
    const diffInDays = Math.ceil((new Date(req.body.toDay).getTime() - new Date(req.body.fromDay).getTime()) / (1000 * 60 * 60 * 24));
    if(new Date(req.body.fromDay) > today && diffInDays === req.body.totalDays){
      vacation.employeeId = employeeId;

      const vacation = new Vacation(req.body);

      console.log(req.body);


      const Vacations = await vacation.save();

      return res.status(200).json(Vacations);
            
    }else{
      res.json({message : 'start date must start from tomorrow date or total days must equal the difference between the start day and the end day'})
    }
  }else {
    const maxDaysLimit = 31;
    const exceededDays = newTotalDaysMax - maxDaysLimit;
    console.log('exceededDays', exceededDays);
    console.log('newTotalDays', newTotalDaysMax);
    const diffInDays = Math.ceil((new Date(req.body.toDay).getTime() - new Date(req.body.fromDay).getTime()) / (1000 * 60 * 60 * 24));
    if(new Date(req.body.fromDay) > today && diffInDays === req.body.totalDays){
    const vacation = new Vacation(req.body);
    vacation.totalDays = 30;
    vacation.employeeId = employeeId;

    // vacation.maxDays += exceededDays;

    console.log(req.body);

    
      const Vacations = await vacation.save();

      return res.status(200).json(Vacations);
    
    }
    else{
      res.json({message : 'start date must start from tomorrow date or total days must equal the difference between the start day and the end day'})
    }
  }
}
else if(age > 50){

  if (newTotalDays <= 45) {
    const diffInDays = Math.ceil((new Date(req.body.toDay).getTime() - new Date(req.body.fromDay).getTime()) / (1000 * 60 * 60 * 24));
    if(new Date(req.body.fromDay) > today && diffInDays === req.body.totalDays){
      vacation.employeeId = employeeId;

      const vacation = new Vacation(req.body);

      console.log(req.body);


      const Vacations = await vacation.save();

      return res.status(200).json(Vacations);
            
    }else{
      res.json({message : 'start date must start from tomorrow date or total days must equal the difference between the start day and the end day'})
    }
  }else {
    const maxDaysLimit = 46;
    const exceededDays = newTotalDaysMax - maxDaysLimit;
    console.log('exceededDays', exceededDays);
    console.log('newTotalDays', newTotalDaysMax);
    const diffInDays = Math.ceil((new Date(req.body.toDay).getTime() - new Date(req.body.fromDay).getTime()) / (1000 * 60 * 60 * 24));
    if(new Date(req.body.fromDay) > today && diffInDays === req.body.totalDays){
    const vacation = new Vacation(req.body);
    vacation.totalDays = 45;
    vacation.employeeId = employeeId;

    // vacation.maxDays += exceededDays;

    console.log(req.body);

    
      const Vacations = await vacation.save();

      return res.status(200).json(Vacations);
    
    }
    else{
      res.json({message : 'start date must start from tomorrow date or total days must equal the difference between the start day and the end day'})
    }
  }

}
  }catch(error){
    res.status(500).json({ message : error.message });

  }
}

const updateVacationDaysinAttendence = async (employeeId, totalDays) => {
  const employee = await Employee.findById(employeeId);
  const attendance = await Attendance.updateMany({employee : employee._id},
    { BalanceVacations : totalDays }
  );
  return attendance;
}


const modifyVacationByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const now = Date.now();
    const today = new Date(now);
    const tomorrow = new Date(now);
    tomorrow.setDate(today.getDate() + 1);
    console.log(req.body);

    const vacation = await Vacation.findById( id);
    if (!vacation) {
      return res
        .status(404)
        .json({ message : `can't find any vacation with ID ${id}` });
    }
    const diffInDays = Math.ceil((new Date(req.body.toDay).getTime() - new Date(req.body.fromDay).getTime()) / (1000 * 60 * 60 * 24));

      if(new Date(req.body.fromDay) > today && diffInDays === req.body.totalDays && vacation.status === 'Pending'){

      const updates = _.pick(req.body, ['reasonForVacation', 'fromDay', 'toDay', 'totalDays']);
      const result = await Vacation.updateOne({ _id : id }, updates);


      const updatedVacation = await Vacation.findById(id);
      res.status(200).json(updatedVacation);
  }else{
    res.json({
      message : 'the start date of a vacation should be after today or total days must equal the difference between the start day and the end day or vacation status should be in pending status',
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
    const today = new Date(now);
    const tomorrow = new Date(now);
    tomorrow.setDate(today.getDate() + 1);

    if (vacation.status === 'Declined' || new Date(vacation.fromDay) > today) {
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
    console.log('req', req.body)
    const { employeeId } = req.body;
    const empVacation = await Vacation.find({ employeeId });
    const empHireDate = await Employee.find({ _id : employeeId });
console.log("empHireDate",empHireDate);
const currentYear = new Date().getFullYear();
const hireDate = empHireDate[0].hireDate.getFullYear()
const dOB = empHireDate[0].DOB.getFullYear();

const noOfYears = currentYear - hireDate ;
const age = currentYear - dOB ;

console.log("currentYear",currentYear);
console.log("hireDate",hireDate);

console.log("noOfYears",noOfYears);
console.log("age",age);

    let totalDaysSum;
    let newTotalDays;
    let TotalDays;
    let totalDaysMaxSum;
    let newTotalDaysMax;
    console.log('empVacation', empVacation);
    if (empVacation) {
      const lastObjectIndex = empVacation.length - 1;
      const lastObject = empVacation[lastObjectIndex];
      const acceptedVacations = empVacation.filter(
        (vacation) => vacation.status === 'Accepted'
      );
      if(acceptedVacations){
      const lastObjectOfAcceptedVacationIndex = acceptedVacations.length - 1;
      const lastObjectOfAcceptedVacation = acceptedVacations[lastObjectOfAcceptedVacationIndex];

      console.log('lastObject', lastObject);
      totalDaysSum = lastObjectOfAcceptedVacation.totalDays
      console.log('totalDaysSum', totalDaysSum);
      totalDaysMaxSum = lastObjectOfAcceptedVacation.maxDays;
      console.log('totalDaysMaxSum', totalDaysMaxSum);
      newTotalDays = totalDaysSum + req.body.totalDays;
      console.log('newTotalDays', newTotalDays);
      newTotalDaysMax = totalDaysMaxSum + req.body.totalDays;
      console.log('newTotalDaysMax', newTotalDaysMax);
      }
    }
    if(noOfYears<10){
      if (newTotalDays <= 21) {
        const vacation = new Vacation(req.body);
        TotalDays = newTotalDays;
        vacation.totalDays = TotalDays;
        console.log('vacation.totalDays', vacation.totalDays);
        console.log('TotalDays', TotalDays);
        console.log(req.body);
        const Vacations = await vacation.save();
        const updateAttendence = updateVacationDaysinAttendence(vacation.employeeId, vacation.totalDays);
        await updateAttendence;
        return res.status(200).json(Vacations);
                
        }else {
          const maxDaysLimit = 22;
          const exceededDays = newTotalDaysMax - maxDaysLimit;
          console.log('exceededDays', exceededDays);
          console.log('newTotalDays', newTotalDaysMax);
          const vacation = new Vacation(req.body);
          vacation.totalDays = 21;
    
          vacation.employeeId = employeeId;
          vacation.maxDays += exceededDays;
    
          console.log(req.body);
    
          const Vacations = await vacation.save();
    
          return res.status(200).json(Vacations);
        
        }
       
      }
    
    else if(noOfYears >=10){
      if (newTotalDays <= 30) {
        const vacation = new Vacation(req.body);
        TotalDays = newTotalDays;
        vacation.totalDays = TotalDays;
        console.log('vacation.totalDays', vacation.totalDays);
        console.log('TotalDays', TotalDays);
        console.log(req.body);
        const Vacations = await vacation.save();
        const updateAttendence = updateVacationDaysinAttendence(vacation.employeeId, vacation.totalDays);
        await updateAttendence;
        return res.status(200).json(Vacations);
                
        }
      else {
        const maxDaysLimit = 31;
          const exceededDays = newTotalDaysMax - maxDaysLimit;
          console.log('exceededDays', exceededDays);
          console.log('newTotalDays', newTotalDaysMax);
          const vacation = new Vacation(req.body);
          vacation.totalDays = 30;
    
          vacation.employeeId = employeeId;
          vacation.maxDays += exceededDays;
    
          console.log(req.body);
    
          const Vacations = await vacation.save();
    
          return res.status(200).json(Vacations);
        
        
        }
        
      }
    
    else if(age > 50){
    
      if (newTotalDays <= 45) {
        const vacation = new Vacation(req.body);
        TotalDays = newTotalDays;
        vacation.totalDays = TotalDays;
        console.log('vacation.totalDays', vacation.totalDays);
        console.log('TotalDays', TotalDays);
        console.log(req.body);
        const Vacations = await vacation.save();
        const updateAttendence = updateVacationDaysinAttendence(vacation.employeeId, vacation.totalDays);
        await updateAttendence;
        return res.status(200).json(Vacations);
                
        }
      else {
        const maxDaysLimit = 46;
          const exceededDays = newTotalDaysMax - maxDaysLimit;
          console.log('exceededDays', exceededDays);
          console.log('newTotalDays', newTotalDaysMax);
          const vacation = new Vacation(req.body);
          vacation.totalDays = 45;
    
          vacation.employeeId = employeeId;
          vacation.maxDays += exceededDays;
    
          console.log(req.body);
    
          const Vacations = await vacation.save();
    
          return res.status(200).json(Vacations);
        
        
        }
        
      
    }    
   
  } catch (error) {
    return res.status(500).json({ message : error.message });
  }
};


const modifyVacationByAdmin = async (req, res) => {
  try {
    const  { id } = req.params;
    const { employeeId } = req.body;
    const empVacation = await Vacation.find({ employeeId : employeeId });
    const empHireDate = await Employee.find({ _id : employeeId });
console.log("empHireDate",empHireDate);
const currentYear = new Date().getFullYear();
const hireDate = empHireDate[0].hireDate.getFullYear()
const dOB = empHireDate[0].DOB.getFullYear();

const noOfYears = currentYear - hireDate ;
const age = currentYear - dOB ;

console.log("currentYear",currentYear);
console.log("hireDate",hireDate);

console.log("noOfYears",noOfYears);
console.log("age",age);
    let totalDaysSum;
    let newTotalDays;
    let TotalDays;
    let totalDaysMaxSum;
    let newTotalDaysMax;
    console.log('empVacation', empVacation);
    if (empVacation) {
      const lastObjectIndex = empVacation.length - 1;
      const lastObject = empVacation[lastObjectIndex];

      const acceptedVacations = empVacation.filter(
        (vacation) => vacation.status === 'Accepted'
      );
      if(acceptedVacations){
      const lastObjectOfAcceptedVacationIndex = acceptedVacations.length - 1;
      const lastObjectOfAcceptedVacation = acceptedVacations[lastObjectOfAcceptedVacationIndex];

      console.log('lastObject', lastObject);

      totalDaysSum = lastObjectOfAcceptedVacation.totalDays
      console.log('totalDaysSum', totalDaysSum);
      totalDaysMaxSum = lastObjectOfAcceptedVacation.maxDays;
      console.log('totalDaysMaxSum', totalDaysMaxSum);
      newTotalDays = totalDaysSum + req.body.totalDays;
      console.log('newTotalDays', newTotalDays);
      newTotalDaysMax = totalDaysMaxSum + req.body.totalDays;
      console.log('newTotalDays', newTotalDaysMax);
      }
    }
    const vacation = await Vacation.findByIdAndUpdate(id);
    console.log('vacation', vacation);
    if (!vacation) {
      return res
        .status(404)
        .json({ message : `can't find any vacation with ID ${id}` });
    }
    if(noOfYears<10){
      if (newTotalDays <= 21) {
        if(req.body.status === 'Accepted')
        {
          TotalDays = newTotalDays;
          vacation.totalDays = TotalDays;
         vacation.status = req.body.status;
    const vacations = vacation.save()
            console.log('vacation.totalDays', vacations.totalDays);
    
      console.log('TotalDays', TotalDays);
           
            const updateAttendence = updateVacationDaysinAttendence(vacation.employeeId, vacation.totalDays);
            await updateAttendence;
            return res.status(200).json(vacation);
          
          }
                
        }else {
          const maxDaysLimit = 22;
      const exceededDays = newTotalDaysMax - maxDaysLimit;
      console.log('exceededDays', exceededDays);
      console.log('newTotalDays', newTotalDaysMax);
      const vacation = new Vacation(req.body);
      vacation.totalDays = 21;

      vacation.employeeId = employeeId;
      vacation.maxDays += exceededDays;


      const Vacations = await vacation.save();

      return res.status(200).json(Vacations);
        
        }
       
      }
    
    else if(noOfYears >=10){
      if (newTotalDays <= 30) {
        if(req.body.status === 'Accepted')
        {
          TotalDays = newTotalDays;
          vacation.totalDays = TotalDays;
         vacation.status = req.body.status;
    const vacations = vacation.save()
            console.log('vacation.totalDays', vacations.totalDays);
    
      console.log('TotalDays', TotalDays);
           
            const updateAttendence = updateVacationDaysinAttendence(vacation.employeeId, vacation.totalDays);
            await updateAttendence;
            return res.status(200).json(vacation);
          
          }
        }
      else {
        const maxDaysLimit = 31;
        const exceededDays = newTotalDaysMax - maxDaysLimit;
        console.log('exceededDays', exceededDays);
        console.log('newTotalDays', newTotalDaysMax);
        const vacation = new Vacation(req.body);
        vacation.totalDays = 30;
  
        vacation.employeeId = employeeId;
        vacation.maxDays += exceededDays;
  
  
        const Vacations = await vacation.save();
  
        return res.status(200).json(Vacations);
        
        
        }
        
      }
    
    else if(age > 50){
    
      if (newTotalDays <= 45) {
        if(req.body.status === 'Accepted')
        {
          TotalDays = newTotalDays;
          vacation.totalDays = TotalDays;
         vacation.status = req.body.status;
    const vacations = vacation.save()
            console.log('vacation.totalDays', vacations.totalDays);
    
      console.log('TotalDays', TotalDays);
           
            const updateAttendence = updateVacationDaysinAttendence(vacation.employeeId, vacation.totalDays);
            await updateAttendence;
            return res.status(200).json(vacation);
          
          }else{
         vacation.status = req.body.status;
    const vacations = vacation.save()    
      console.log('TotalDays', TotalDays);
            return res.status(200).json(vacations);
          }
                
        }
      else {
        const maxDaysLimit = 46;
        const exceededDays = newTotalDaysMax - maxDaysLimit;
        console.log('exceededDays', exceededDays);
        console.log('newTotalDays', newTotalDaysMax);
        const vacation = new Vacation(req.body);
        vacation.totalDays = 45;
  
        vacation.employeeId = employeeId;
        vacation.maxDays += exceededDays;
  
  
        const Vacations = await vacation.save();
  
        return res.status(200).json(Vacations);
        
        }
        
      
    }    
   
   
  } catch (error) {
    return res.status(500).json({ message : error.message });
  }
};


module.exports = {
  getAllVacations,

  // getOneVacation,

  applyForVacation,

  modifyVacationByAdmin,

  removeVacation,

  // getOneVacationWithUserData,

  getVacationWithemployeeId,
  applyForVacationByAdmin,
  modifyVacationByUser
};
