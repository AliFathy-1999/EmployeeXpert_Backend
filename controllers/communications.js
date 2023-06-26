const Communications = require('../DB/models/comunications');



const create                = (data) =>  Communications.create(data);
const findEmpMessages  =  async (data) => {
    
                              const messages = await Communications.find({ recieverEmp: data.empId });
                              return messages

}

const findDepMessages  =  async (data) => {
    
    const messages = await Communications.find({ recieverDep: data.depId });
    return messages

}

const findAllMessages  =  async (data) => {
    
    const messages = await Communications.find({ recieverEmp: data.all});
    return messages

}

module.exports = {
  create,
  findDepMessages,
  findEmpMessages,
  findAllMessages
};