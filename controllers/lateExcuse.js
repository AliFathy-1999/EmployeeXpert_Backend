const Excuse = require('../DB/models/LateExcuse')

const createExcuse = (employeeId,data) => Excuse.create(employeeId,data);

module.exports={
    createExcuse,
}
