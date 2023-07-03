const Holiday = require('../DB/models/holiday');

const creteHoliday = (data) => Holiday.create(data);

const getAllHolidays = async (page, limit) => {
    if (!limit) limit = 10;
    if (!page) page = 1;
    const paginatedHolidays = await Holiday.paginate({},{ page, limit });
    return paginatedHolidays;
  };

const getOneHoliday = async (id) => {
    const oneHoliday = await Holiday.findById(id);
    return oneHoliday;
};

const updateHoliday = async(req,res) => {
    try{
const {id} = req.params;
const holiday = await Holiday.findByIdAndUpdate(id, req.body);
    if(!holiday){
        return res.status(404).json({message : `can't find any holiday with ID ${id}`});
    }
    const updatedHoliday = await Holiday.findById(id);
    res.status(200).json(updatedHoliday);

    }catch(error){
        console.log(error.message);
        res.status(500).json({message : error.message});
  }
};

const deleteHoliday = async(req,res)=>{
    try{
        const {id} = req.params;
        const holiday = await Holiday.findById(id, req.body);
            if(!holiday){
                return res.status(404).json({message : `can't find any holiday with ID ${id}`});
            }
            const deletedHoliday = await Holiday.findByIdAndDelete(id);
            return res.status(200).json({ message : 'holiday deleted successfully' });
            }catch(error){
                console.log(error.message);
                res.status(500).json({message : error.message});
          }   
}

module.exports = {
    creteHoliday,
    getAllHolidays,
    getOneHoliday,
    updateHoliday,
    deleteHoliday
}