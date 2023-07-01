const Excuse = require('../DB/models/Excuse')

const createExcuse = (data) => Excuse.create(data);

const deleteExecuse = (excuseId) => Excuse.findOneAndDelete({_id:excuseId})

module.exports={
    createExcuse,
    deleteExecuse
}
