const casualVacations = require("../DB/models/casualVacations");

const getAllCasualVacations = async (req, res) => {
  try {
    const page = req.query.page || 0;
    let limit = req.query.limit || 10;
    if(limit > 20){
      limit = 10;
    }
    else{
      limit = req.query.limit ;
    }
    const count = await casualVacations.countDocuments({});

    const allCasualVacations = await casualVacations.find({}).sort({employeeId : 1}).skip(page * limit).limit(limit).populate({
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
      nextPage :   nextPage ? `/casualVacations?page=${nextPage}` : null,
      prevPage :   prevPage ? `/casualVacations?page=${prevPage}` : null,
    };
    return res.status(200).json({allCasualVacations, paginationInfo});
  } catch (error) {
    return res.status(500).json({ message : error.message });
  }
};


const getCasualVacationWithemployeeId = async (req, res) => {
    try {
      const page = req.query.page || 0;
      let limit = req.query.limit || 10;
      if(limit > 20){
        limit = 10;
      }
      else{
        limit = req.query.limit ;
      }
      const count = await casualVacations.countDocuments({});
      const employeeId = req.user._id;
      
      const myCasualVacations = await casualVacations.find({ employeeId : employeeId }).skip(page * limit).limit(limit);
      console.log(req.user._id)
      console.log('employeeId', employeeId);
      console.log('myCasualVacations', myCasualVacations);
  
      const totalPages = Math.ceil(count / limit);
      const nextPage = page < totalPages - 1 ? page + 1 : null;
      const prevPage = page > 0 ? page - 1 : null;
      const paginationInfo = {
        totalCount : count,
        totalPages,
        nextPage :   nextPage ? `/myCasualVacations?page=${nextPage}` : null,
        prevPage :   prevPage ? `/myCasualVacations?page=${prevPage}` : null,
      };
      res.status(200).json({myCasualVacations, paginationInfo});
    } catch (error) {
      res.status(500).json({ message : error.message });
    }
  };
  

  const applyForCasualVacation = async (req, res) => {
    try {
const employeeId = req.user._id;
console.log("employeeId",employeeId);
const empCasualVacation = await  casualVacations.find({employeeId:employeeId});
console.log("empCasualVacation",empCasualVacation);
let totalDaysSum;
let newTotalDays=0;
let lastObject;
const now = Date.now();
const today = new Date(now);
const tomorrow = new Date(now);
tomorrow.setDate(today.getDate() + 1);
const dateOnly = today.toISOString().slice(0, 10);
console.log('empCasualVacation', empCasualVacation.length);
// console.log("today",today);
if(empCasualVacation && empCasualVacation.length >0){
    const lastObjectIndex = empCasualVacation.length - 1;
    lastObject = empCasualVacation[lastObjectIndex];
   console.log('lastObject', lastObject);
   totalDaysSum = lastObject.casualVacation;
   console.log('totalDaysSum', totalDaysSum);
   newTotalDays = totalDaysSum + req.body.totalCasDays;
   console.log('newTotalDays', newTotalDays);
}
else{
totalDaysSum = req.body.totalCasDays;
console.log("totalDaysSum",totalDaysSum);
newTotalDays=totalDaysSum;
console.log("newTotalDays",newTotalDays);
}

if(newTotalDays <= 7){
    if(req.body.totalCasDays <=2){
        const casual = new casualVacations(req.body);
        casual.employeeId = employeeId;
        casual.casualVacation = newTotalDays;
        console.log("Second newTotalDays",newTotalDays);
        const casVacations = await casual.save();
        return res.status(200).json(casVacations);
    }
    else{
        res.json({message:"sorry you can not take more than two days"});
    }
}else{
    res.json({message : 'Sorry You have consumed all your casual days , if you want to take a vacation it will be an annual vacation, Have a Nice Day'})

}

}
     catch (error) {
      return res.status(500).json({ message : error.message });
    }
  };
  

module.exports={
    getAllCasualVacations,
    getCasualVacationWithemployeeId,
    applyForCasualVacation
}