
const express = require('express');
const router = express.Router();
const { communicationsController } = require('../controllers/index');
const { validate } = require('../middlewares/validation');
const {message} = require('../Validations/communications')
const Employee = require('../DB/models/employee')
const Department = require('../DB/models/department')
const { AppError,asycnWrapper } = require('../lib/index');
const {adminAuth , Auth} = require('../middlewares/auth');



router.post('/toemployee', adminAuth, validate(message), async(req, res, next)=>{

            if (req.body.Emp) {

                    const { body: { Emp, message } } = req
                    const sender = req.user._id 
                    const sentMessage = communicationsController.create({ Emp , sender : sender.toString() , message });
                    const [err, data] = await asycnWrapper(sentMessage);

                    if (err) {
                    return next(err);  
                  
                    }

                   res.status(201).json({ status : 'success', data });  

                    }else {
                    res.status(400).json({ status : 'failed', data: "Emp is required" });
                    }
  });


  router.post('/todepartment', adminAuth, validate(message), async(req, res, next)=>{

            if (req.body.Dep) {

                    const { body: { Dep, message } } = req
                    const sender = req.user._id
                    const sentMessage = communicationsController.create({ Dep , sender : sender.toString(), message });
                    const [err, data] = await asycnWrapper(sentMessage);

                    if (err) {
                    return next(err)
                    }

                    res.status(201).json({ status : 'success', data })

            }else{
                res.status(400).json({ status : 'failed', data: "Dep is required" })
            }
  });



router.post('/toall', adminAuth, validate(message), async(req, res, next)=>{


      if(req.body.All ){
            const { body: { All, message } } = req
            const sender = req.user._id 
            const sentMessage = communicationsController.create({ All , sender : sender.toString(), message });
            const [err, data] = await asycnWrapper(sentMessage);

            if (err) return next(err);    
            res.status(201).json({ status : 'success',data });   
    }else{

        res.status(400).json({ status : 'failed', data : 'All is required' });
    }


})

router.get('/lastAnouncement',Auth, async(req, res)=>{

        try{
            
            data = await communicationsController.findLastAouncement()
            res.status(201).json({ status : 'success', data }); 

        }catch(erorr){
            res.status(400).json({ status : 'failed', data : "no anouncements found"});  
        }


        })

router.get('/allAnouncements',Auth, async(req, res)=>{

    try{
        
        data = await communicationsController.findAllAnouncements()
        res.status(201).json({ status : 'success', data }); 

    }catch(erorr){
        res.status(400).json({ status : 'failed', data : "no anouncements found"});  
    }
   
    
})


router.get('/DepartmentMessages/:Dep',Auth, async(req, res)=>{

    try{
            data = await communicationsController.findDepMessages(req.params.Dep)
            res.status(201).json({ status : 'success', data});   
    }catch(erorr){
                res.status(400).json({ status : 'failed' , data : "not found this dep"}); 
    }
    
    
})

router.get('/EmpolyeeMessages/:Emp',Auth, async(req, res)=>{

    if (req.user.role === 'ADMIN' || req.user._id.toString() === req.params.Emp )
            try {
                const employee = await Employee.findOne({_id : req.params.Emp });
                data = await communicationsController.findEmpMessages(req.params.Emp ,req.user._id )
                res.status(201).json({ status : 'success', data});

            } catch (error) {
                return res.status(400).json({ status : 'fail', message : `No Employee with ID ${req.params.Emp }` });
            }
  else
    return next(new AppError('Access denied. You do not have the privilege to perform this action.', 403));
   
})

module.exports = router;