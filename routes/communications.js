
const express = require('express');
const router = express.Router();
const { communicationsController } = require('../controllers/index');
const { validate } = require('../middlewares/validation');
const {message} = require('../Validations/communications')
const Employee = require('../DB/models/employee')
const Department = require('../DB/models/department')
const { AppError,asycnWrapper } = require('../lib/index');
const {adminAuth} = require('../middlewares/auth');

router.post('/toemployee', adminAuth, validate(message), async(req, res, next)=>{
    const { body: { Emp, message } } = req
    const sender = req.user._id
    const employee = await Employee.findOne({_id: Emp});
    if (!employee) 
        return next(new AppError(' cant found this employee'), 400) 
    const sentMessage = communicationsController.create({ Emp, sender : sender.toString(), message });
    const [err, data] = await asycnWrapper(sentMessage);
    if (err) return next(err);    
    res.status(201).json({ status : 'success', data });
})

router.post('/todepartment', validate(message), async(req, res)=>{
    data = req.body
    const sender = await Employee.findOne({_id : data.sender})

    if (!sender) 
      return res.status(400).json({ status : 'fail', message : `No Employee with ID ${data.sender}` });

    if(('Dep' in data)){
        const department = await Department.findOne({_id : data.Dep});
        if (!department) 
          return res.status(400).json({ status : 'fail', message : `No Department with ID ${data.Dep}` });    
    }else{
        return res.status(400).json({ status : 'fail', message : 'no Department has selected' });
    }
    const sentMessage = await communicationsController.create(data);
    res.status(201).json({ status : 'success', data });
})

router.post('/toall', validate(message), async(req, res)=>{
    data = req.body
    if(!('All' in data) || data.All == false){
        return res.status(400).json({ status : 'fail', message : 'no Reciever has selected' });
    }
    else{
        const sentMessage = await communicationsController.create(data);
    }
    res.status(201).json({ status : 'success', data }); 
})

router.get('/Anouncements', async(req, res)=>{
    data = await communicationsController.findAllMessages()
    res.status(201).json({ status : 'success', data }); 
})

router.get('/DepartmentMessages/:Dep', async(req, res)=>{
    data = await communicationsController.findDepMessages(req.params.Dep)
    res.status(201).json({ status : 'success', data}); 
})

router.get('/EmpolyeeMessages/:Emp', async(req, res)=>{
    data = await communicationsController.findEmpMessages(req.params.Emp)
    res.status(201).json({ status : 'success', data});   
})

module.exports = router;