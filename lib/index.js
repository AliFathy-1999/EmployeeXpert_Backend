
const { handleResponseError } = require('./handlingErrors');
const { AppError } = require('./appError');


const trimText = (text) => {
    return text.replace(/\s+/g, ' ');
}

const asycnWrapper = (promise) => promise.then((data) => [undefined, data]).catch((err) => [err]);


module.exports = { asycnWrapper, AppError, handleResponseError, trimText };
