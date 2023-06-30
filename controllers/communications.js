const Communications = require('../DB/models/comunications');


const create = (data) => Communications.create(data);
const findMyMessages = async ( userId) => {
    try{

        const messages = await Communications.find({ employee : userId})
        return messages  
    }
    catch(erorr){
        return "no messages"
    }

}
const findEmpMessages = async (data , userId) => {
    try{
        console.log(data,userId)
     const messages = await Communications.find({
        employee : data , sender : userId
        
      });
   
    return messages   
    }
    catch(erorr){
        return "no messages"
    }
    
}

const findDepMessages = async (data) => {
    const messages = await Communications.find({ department : data });
    return messages
}

const findLastAouncement = async () => {
    const messages = await Communications.find({ isForAll : true}).sort({ createdAt : -1}).limit(1);
    return messages
}

const findAllAnouncements = async () => {
    const messages = await Communications.find({ isForAll : true})
    return messages
}

module.exports = {
  create,
  findDepMessages,
  findEmpMessages,
  findLastAouncement ,
  findAllAnouncements ,
  findMyMessages
};