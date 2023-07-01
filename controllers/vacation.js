const Vacation = require('../DB/models/vacation');


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

    const allVacations = await Vacation.find({}).sort({employeeId : 1}).skip(page * limit).limit(limit);

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
    // console.log(error.message);

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
    // console.log(error.message);

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

    // console.log(employeeId);

    const empVacation = await Vacation.find({ employeeId : employeeId });
    let totalDaysSum;
    let newTotalDays;
    let TotalDays;


    if (empVacation) {
      totalDaysSum = empVacation.reduce((sum, obj) => {
        return sum + obj.totalDays;
      }, 0);
    }
    newTotalDays = totalDaysSum + req.body.totalDays;

    // console.log(totalDaysSum);

    if (newTotalDays <= 21) {
      const vacation = new Vacation(req.body);
      const now = Date.now();
      const date = new Date(now);
      if (vacation.fromDay > date) {
        vacation.employeeId = employeeId;
        TotalDays = totalDaysSum + req.body.totalDays;
        vacation.totalDays = TotalDays;
        const Vacations = await vacation.save();

        // console.log(newTotalDays);
        // console.log(TotalDays);

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
      vacation.employeeId = employeeId;
      vacation.maxDays += exceededDays;
      const Vacations = await vacation.save();

      // console.log(exceededDays);
      // console.log(vacation.maxDays);

      return res.status(200).json(Vacations);
    }
  } catch (error) {
    // console.log(error.message);

    return res.status(500).json({ message : error.message });
  }
};

const modifyVacation = async (req, res) => {
  try {
    const { id } = req.params;
    const vacation = await Vacation.findByIdAndUpdate(id, req.body);
    if (!vacation) {
      return res
        .status(404)
        .json({ message : `can't find any vacation with ID ${id}` });
    }d
    const updatedVacation = await Vacation.findById(id);
    res.status(200).json(updatedVacation);
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

    if (vacation.status == 'Declined' || date < vacation.fromDay) {
      const deletedVacation = await Vacation.findByIdAndDelete(id, req.body);

      if (!deletedVacation) {
        return res
          .status(404)
          .json({ message : `Can't find any vacation with ID ${id}` });
      }

      return res.status(200).json({ message : 'Vacation deleted successfully' });
    } else {
      // console.log(vacation.fromDay);
      // console.log(vacation.toDay);

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

    // console.log(employeeId);

    const empVacation = await Vacation.find({ employeeId });
    let totalDaysSum;
    let newTotalDays;
    let TotalDays;
    if (empVacation) {
      totalDaysSum = empVacation.reduce((sum, obj) => {
        return sum + obj.totalDays;
      }, 0);
    }
    newTotalDays = totalDaysSum + req.body.totalDays;

    // console.log(totalDaysSum);

    if (newTotalDays <= 21) {
      const vacation = new Vacation(req.body);
      const now = Date.now();
      const date = new Date(now);
      if (vacation.fromDay > date) {
        TotalDays = totalDaysSum + req.body.totalDays;
        vacation.totalDays = TotalDays;
        const Vacations = await vacation.save();

        // console.log(newTotalDays);
        // console.log(TotalDays);

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
      vacation.employeeId = employeeId;
      vacation.maxDays += exceededDays;


      const Vacations = await vacation.save();

      // console.log(exceededDays);

      // console.log(vacation.maxDays);

      return res.status(200).json(Vacations);
    }
  } catch (error) {
    // console.log(error.message);

    return res.status(500).json({ message : error.message });
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
  applyForVacationByAdmin,
};
