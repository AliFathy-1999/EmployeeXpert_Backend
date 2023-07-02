const Holiday = require('../DB/models/holiday');

const creteHoliday = (data) => Holiday.create(data);

module.exports = {
    creteHoliday
}