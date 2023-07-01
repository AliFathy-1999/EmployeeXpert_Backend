const Excuse = require('../DB/models/Excuse')

const createExcuse = async (data) =>{
  const excuse = await Excuse.create(data);
  return excuse;
} 

const getAllExcuses = async (req, res) => {
  try {
    const page = req.query.page || 0;
    let limit = req.query.limit || 10;
    if(limit > 20){
      limit = 10;
    }
    else{
      limit = req.query.limit ;
    }
    const count = await Excuse.countDocuments({});

    const allExcuses = await Excuse.find({}).sort({employeeId : 1}).skip(page * limit).limit(limit);

    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages - 1 ? page + 1 : null;
    const prevPage = page > 0 ? page - 1 : null;
    const paginationInfo = {
      totalCount : count,
      totalPages,
      nextPage :   nextPage ? `/excuse?page=${nextPage}` : null,
      prevPage :   prevPage ? `/excuse?page=${prevPage}` : null,
    };
    return res.status(200).json({allExcuses, paginationInfo});
  } catch (error) {
    return res.status(500).json({ message : error.message });
  }
}

// const getAllExcuses = async (req, res) => {
  
// };
module.exports = {
    createExcuse,
    getAllExcuses
}
