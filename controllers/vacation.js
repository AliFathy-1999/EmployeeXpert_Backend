const Vacation = require('../DB/models/vacation');

const getAllVacations = async (req,res) => {
    try{
    const allVacations = await Vacation.find({});
    return res.status(200).json(allVacations);
    }catch(error){
        console.log(error.message);
    return res.status(500).json({message:error.message});
    }
};


const getOneVacation= async(req,res)=>{
    try{
    const {id} = req.params;
    const vacation = await Vacation.findById(id);
    res.status(200).json(vacation);
    }catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
};
    
const getOneVacationWithUserData= async(req,res)=>{
    try{
    const {id} = req.params;
    const vacation = await Vacation.findById(id).populate({
        path: 'employeeId',
        select: 'firstName lastName nationalId position phoneNumber'
    }).exec();
    res.status(200).json(vacation);
    }catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
};


const getVacationWithemployeeId = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const vacations = await Vacation.find({ employeeId: employeeId });

      res.status(200).json(vacations);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  };



const applyForVacation= async(req,res)=>{
    try{
        const {employeeId} = req.user._id;
        const empVacation = await Vacation.find({employeeId});
        // let maxTotalDays=21;
        let totalDaysSum = empVacation.reduce((sum, obj) => {
            return sum+ obj.totalDays
          }, 0);
          let newTotalDays = totalDaysSum;
        console.log(newTotalDays);

  if (newTotalDays <=  21) {
    const Vacations = await Vacation.create(req.body);
    console.log(newTotalDays);
    return res.status(200).json(Vacations);
  } else {
        // let maxTotalDaysSum = empVacation.reduce((sum, obj) => {
        //     return sum+ obj.totalDays
        //   }, 0);
        //   let newTotalDays = totalDaysSum;
        // console.log(newTotalDays);
    res.json({
      message:
        "Unfortunately, you cannot take more vacations as you have crossed the limit of 21 days",
    });
  }

    }
    catch(error){
        console.log(error.message);
       return  res.status(500).json({message:error.message});

    }
}
    
const modifyVacation= async(req,res)=>{
    try{
    const {id} = req.params;
    const vacation = await Vacation.findByIdAndUpdate(id,req.body);
    if(!vacation){
        return res.status(404).json({message:`can't find any vacation with ID ${id}`});
    }
    const updatedVacation = await Vacation.findById(id);
    res.status(200).json(updatedVacation);
    
    }catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message});
    
    }
        }



        const removeVacation = async(req,res)=>{
            try{
        
                const {id} = req.params;
                const vacation = await Vacation.findById(id);
        
                if (!vacation) {
                    return res.status(404).json({message:`Can't find any vacation with ID ${id}`});
                }
        
                const now = Date.now();
                const date = new Date(now);
                
                if( vacation.status == 'Declined' || date < vacation.fromDay){
                    const deletedVacation = await Vacation.findByIdAndDelete(id,req.body);
        
                    if(!deletedVacation){
                        return res.status(404).json({message:`Can't find any vacation with ID ${id}`});
                    }
        
                    return res.status(200).json({message:'Vacation deleted successfully'});
                }
                else{
                    console.log(vacation.fromDay);
                    console.log(vacation.toDay);
                    res.json({message:"Sorry, you can't cancel it"});
                }
            }
            catch(error){
                console.log(error.message);
                res.status(500).json({message:error.message});
            }
        };



module.exports = {
       getAllVacations,
        getOneVacation,
        applyForVacation,
        modifyVacation,
        removeVacation,
        getOneVacationWithUserData,
        getVacationWithemployeeId,
};