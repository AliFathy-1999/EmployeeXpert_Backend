const Communications = require('../DB/models/comunications');


const create = (data) => Communications.create(data);

const findEmpMessages = async (data) => {
    const messages = await Communications.find({ Emp : data });
    return messages
}

const findDepMessages = async (data) => {
    const messages = await Communications.find({ Dep : data });
    return messages
}

const findAllMessages = async () => {
    const messages = await Communications.find({ All : true});
    return messages
}

module.exports = {
  create,
  findDepMessages,
  findEmpMessages,
  findAllMessages
};