
const { AppError } = require('../lib/index');

const jwt = require('jsonwebtoken');
const Employee = require('../DB/models/employee');


const verifyToken = async (bearerToken) => {
  bearerToken = bearerToken.split(' ')[1];
  if(!bearerToken) return new AppError('Sign in again',401); 
  const decoded = jwt.verify(bearerToken, process.env.TOKEN_KEY);
  const user = await Employee.findById(decoded.userId);
  if(!user) return new AppError('un-authenticated',401); 
  return user;
};

const userAuth = async (req, res, next) => {
  let bearerToken = req.headers.authorization; 
  try {
    if (!bearerToken) throw new Error('Un-Authenticated');
    const result = await verifyToken(bearerToken);
    if (result.role !== "USER") throw new AppError('Unauthorized-User',403);
    req.user = result
    return next();
  } catch (err) {
    next(err);
  }
};

const adminAuth = async (req, res, next) => {
  let bearerToken = req.headers.authorization;  
  try {
    if (!bearerToken) throw new Error('Unauthenticated-User');
    const result = await verifyToken(bearerToken);
    if (result.role !== "ADMIN") throw new AppError('Unauthorized-User',403);
    req.user = result;
    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = { userAuth, adminAuth };
