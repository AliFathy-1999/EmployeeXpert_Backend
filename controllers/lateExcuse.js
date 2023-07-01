const Excuse = require('../DB/models/Excuse')

const createExcuse = (employeeId,data) => Excuse.create(employeeId,data);

module.exports={
    createExcuse,
}
