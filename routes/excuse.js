const express = require('express');
const { asycnWrapper, AppError} = require('../lib/index');
const {userAuth, Auth, adminAuth} = require('../middlewares/auth');
const excuseController = require('../controllers/excuse')
const Excuse = require('../DB/models/Excuse')

const router = express.Router();

router.post('/', userAuth, async (req, res, next)=>{
    const employeeId = req.user._id;
    const { reason, from, to, typeOfExcuse } = req.body;

    const createExcuse = excuseController.createExcuse({
        employeeId,
        reason, 
        from, 
        to, 
        typeOfExcuse
    });
    const [err, data] = await asycnWrapper(createExcuse)
    if(err) return next(err);
    res.status(201).json({status : 'success', data});
})

router.delete('/:id', userAuth, async(req, res, next)=>{
    const excuseId = req.params.id;
    const deleteExecuse = excuseController.deleteExecuse(excuseId);
    const [err, data] = await asycnWrapper(deleteExecuse);
    if(err) return next(err);
    if (!data) return next(new AppError (`No Excuse with ID ${excuseId}`, 400));
    res.status(200).json({ status : 'success' });
    
})

router.get('/all', Auth, async (req, res, next) => {
        const { page, limit } = req.query
        const getAllExcuses = excuseController.getAllExcuses(page, limit);
        const [err, data] = await asycnWrapper(getAllExcuses);
            if (err) return next(err);
        res.status(200).json({ status : 'success', data });
      });

// const updateExcussion = async(req, res)=>{
//   try {
//     const { id } = req.params;
//     const Excuses = await Excuse.findByIdAndUpdate(id, req.body);
//     if (!Excuses) {
//       return res
//         .status(404)
//         .json({ message : `can't find any Excuse with ID ${id}` });
//     }
//     const updatedExcuses = await Excuse.findById(id);
//     if(updatedExcuses.respond === 'Accepted'){
//       updatedExcuses.noOfExcuses = updatedExcuses.noOfExcuses + 1;
//       res.status(200).json(updatedExcuses);
//     }
//     else{res.status(200).json(updatedExcuses);}
//   } catch (error) {
//     res.status(500).json({ message : error.message });
//   }

// }


router.patch('/:id', Auth, async(req, res, next)=>{
  const { id } = req.params;
  console.log(req.params)
  const {reason,day, from, to, respond, typeOfExcuse} = req.body;
  const Excuses = excuseController.updateExcussion(id, {
    reason,
    day,
    from,
    to,
    respond,
    typeOfExcuse
  });
  console.log(from)
  const [err, data] = await asycnWrapper(Excuses);
  if(err){return next(err)}
   if (!data) {
    return next(new AppError (`can't find any Excuse with ID ${id}`, 400))
    }
    console.log("data = " , data)
    const updatedExcuses = await Excuse.findById(id);
    // console.log(updatedExcuses)
    if(updatedExcuses.respond === 'Accepted'){
      updatedExcuses.noOfExcuses = updatedExcuses.noOfExcuses + 1;
      res.status(200).json(updatedExcuses);
    }
    else{res.status(200).json(updatedExcuses);}
});

router.get('/:id', userAuth, excuseController.getOneExcuse);


  
module.exports = router


