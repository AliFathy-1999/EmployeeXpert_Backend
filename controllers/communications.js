const Communications = require('../DB/models/comunications');


const create = (data) => Communications.create(data);

const findEmpMessages = async (data , userId) => {
    try{
     const messages = await Communications.find({
        $and: [
          { Emp : data, sender : userId },
          { Emp : userId , Emp:data  },
        ],
      });
    return messages   
    }
    catch(erorr){
        return "not found"
    }
    
}

const findDepMessages = async (data) => {
    const messages = await Communications.find({ Dep : data });
    return messages
}

const findLastAouncement = async () => {
    const messages = await Communications.find({ All : true}).sort({ createdAt : -1}).limit(1);
    return messages
}

const findAllAnouncements = async () => {
    const messages = await Communications.find({ All : true})
    return messages
}

module.exports = {
  create,
  findDepMessages,
  findEmpMessages,
  findLastAouncement ,
  findAllAnouncements 
};