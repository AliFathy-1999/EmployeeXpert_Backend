const Communications = require('../DB/models/comunications');

const create = (data) => {
    return Communications.create(data)
};

const findMyMessage = async ( userId) => {
        const messages = Communications.find({ employee : userId})
        return messages  
    }

    const findMyLastMessage = async ( userId) => {
        console.log(userId)
        const messages = Communications.find({ employee : userId}).sort({ createdAt : -1}).limit(1);
        return messages  
    }
    
const findEmpMessages = async (data, userId) => {
    const messages = Communications.find({ employee : data, sender : userId})
    return messages   
}

const findDepMessages = async (data) => {
    const messages = Communications.find({ department : data });
    return messages
}

const findLastAouncement = async () => {
    const messages = Communications.find({ isForAll : true}).sort({ createdAt : -1}).limit(1);
    return messages
}

const findAllAnouncements = async () => {
    const messages = Communications.find({ isForAll : true})
    return messages
}

module.exports = {
  create,
  findDepMessages,
  findEmpMessages,
  findLastAouncement,
  findAllAnouncements,
  findMyMessage,
  findMyLastMessage

};