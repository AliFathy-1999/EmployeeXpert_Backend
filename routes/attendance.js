const express = require('express');
const { attendanceController }  = require('../controllers/index');

const { userAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/', userAuth, async (req, res, next) => {
  // Check in  
  const { checkInTimestamp, reason } = req.body;
  
  // Use authenticated user from middleware  
  const attendance = attendanceController.checkIn({
    checkInTimestamp, 
    reason,  
    employee: req.user._id  
  });
  
  // Save check in   
  const [err, data] = await asyncWrapper(attendance);  
  if(err) return next(err);
  
  res.json({ status: 'success', data});
});

// Other routes here using userAuth middleware

module.exports = router;