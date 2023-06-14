class AppError extends Error {
  status;
  isOperational; 
  constructor(message,statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = false;
    Error.captureStackTrace(this, this.constructor);
  }
}



module.exports = { AppError };
