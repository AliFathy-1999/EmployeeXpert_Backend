const Excuse = require('../DB/models/Excuse')

const createExcuse = async (data) =>{
  const excuse = await Excuse.create(data);
  return excuse;
} 

module.exports={
    createExcuse,
}
