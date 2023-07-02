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
}

module.exports = {
    creteHoliday,
    getAllHolidays,
    getOneHoliday
}