/* eslint-disable no-console */
const Excuse = require('../DB/models/Excuse')

const createExcuse = (data) => Excuse.create(data);

const deleteExecuse = (excuseId) => Excuse.findOneAndDelete({_id : excuseId})

const getAllExcuses = async (page, limit) => {
  try {

    if(!page) page = 0;
    if(!limit) limit = 10;

    if(limit > 20){
      limit = 10;
    }
    else{
      limit = limit ;
    }
    const count = await Excuse.countDocuments({});

    const allExcuses = await Excuse.find({}).sort({employeeId : 1}).skip(page * limit).limit(limit);

    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages - 1 ? page + 1 : null;
    const prevPage = page > 0 ? page - 1 : null;
    const paginationInfo = {
      totalCount : count,
      totalPages,
      nextPage :   nextPage ? `/all?page=${nextPage}` : null,
      prevPage :   prevPage ? `/all?page=${prevPage}` : null,
    };
    let paginated = {allExcuses, paginationInfo};
    return paginated ;
  } catch (error) {
    return error;
  }
}


const updateExcussion = async(id, data)=> {
  const Excuses = await Excuse.findOneAndUpdate({_id : id}, data, {
    runValidators : true,
    new :           true
  }); 
  return Excuses;
}


const updateExcussionByAdmin = async(id, respond)=> {
  const Excuses = await Excuse.findOneAndUpdate({_id : id}, { $set : { respond : respond } }, {
    runValidators : true,
    new :           true
  }); 
  return Excuses;
}

const getOneExcuse = (id) => Excuse.findById( id)

module.exports = {
    createExcuse,
    getAllExcuses,
    deleteExecuse,
    updateExcussion,
    updateExcussionByAdmin,
    getOneExcuse
}
