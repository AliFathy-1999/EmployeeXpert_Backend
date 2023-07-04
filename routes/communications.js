const express = require("express");
const router = express.Router();
const { communicationsController } = require("../controllers/index");
const { validate } = require("../middlewares/validation");
const { message } = require("../Validations/communications");
const Employee = require("../DB/models/employee");
const Department = require("../DB/models/department");
const { AppError, asycnWrapper } = require("../lib/index");
const { adminAuth, Auth } = require("../middlewares/auth");
const { request } = require("../app");


// Send a message to specific employee

const empSubscriber = {};

router.get('/message', Auth, async (req, res, next) => {
  const ID = req.user._id
  empSubscriber[ID] = res;
  req.on('close', () => {
    delete empSubscriber[ID];
  });
});

router.post('/toemployee', adminAuth, validate(message), async (req, res, next) => {
    const { body: { title, message, employee } } = req;
      const sender = (req.user._id).toString();
      const sentMessage = communicationsController.create({ title, message, employee : employee.toString(), sender : sender.toString()});
      const [err, data] = await asycnWrapper(sentMessage);
      if (err) return next(err);
      Object.keys(empSubscriber).forEach((ID) => {
        if(ID == employee){
          empSubscriber[ID].json(data);
        }
        delete empSubscriber[ID];
      });
      res.status(201).json({ status : 'success', data });
  });

// const depSubscriber = [];

  router.get('/dep-message', Auth, async (req, res, next) => {

    const sentMessage = communicationsController.findDepMessages();
    const [err, data] = await asycnWrapper(sentMessage);
    if (err) return next(err);
    res.status(201).json({ status : 'success', data });
    // const departmentEmployees = await Employee.find({ depId: id }).exec();
    // const employeeIds = departmentEmployees.map(employee => employee._id.toString()); 
    // employeeIds.forEach((employeeId) => {
    //   depSubscriber.push({ ID: employeeId, response: res });
    // })
    // req.on('close', () => {
    //   const index = depSubscriber.findIndex(subscriber => subscriber.id === employeeIds);
    //   console.log(index);
    //   if (index !== -1) {
    //     depSubscriber.splice(index, 1);
    //   }
    // });
  });
router.post('/todepartment', adminAuth, validate(message), async (req, res, next) => {
      const { body: { title, department, message } } = req;
      const sender = (req.user._id).toString();
      const sentMessage = communicationsController.create({ department, sender, title, message});
      const [err, data] = await asycnWrapper(sentMessage);
      if (err) return next(err);
      res.status(201).json({ status : 'success', data });
      // const { body: { title, message, department } } = req;
      // const sender = req.user._id.toString();
      
      // const departmentEmployees = await Employee.find({ department: department }).exec();
      // const employeeIds = departmentEmployees.map(employee => employee._id.toString());
      
      // const sentMessage = communicationsController.create({ title, message, department, sender });
      // const [err, data] = await asycnWrapper(sentMessage);
      // if (err) return next(err);
      
      // depSubscriber.forEach(subscriber => {
      //   if(subscriber.ID == req.user.depId)
      //   subscriber.response.json(data);
      // });
    
      // res.status(201).json({ status: 'success', data });
});

// Send Announcement to all employees

const allSubscribers = {};

router.get('/announcement', async (req, res) => {
    const ID = Math.ceil(Math.random() * 1000000);
    allSubscribers[ID] = res;
    req.on('close', () => {
      delete allSubscribers[ID];
    });
});

router.post("/toall", adminAuth, validate(message), async (req, res, next) => {
  if (req.body.isForAll) {
    const {
      body: { isForAll, message , title },
    } = req;
    const sender = req.user._id;
    const sentMessage = communicationsController.create({
        isForAll:isForAll,
      sender: sender.toString(),
      message,
      title
    });
    const [err, data] = await asycnWrapper(sentMessage);
    if (err) return next(err);
    Object.keys(allSubscribers).forEach((ID) => {
      allSubscribers[ID].json(data);
      delete allSubscribers[ID];
    });
    res.status(201).json({ status : 'success', data });
}});

router.get("/lastAnouncement", Auth, async (req, res) => {
    const sentMessage = communicationsController.findLastAouncement();
    const [err, data] = await asycnWrapper(sentMessage);
    if (err) return next(err);
    res.status(201).json({ status : 'success', data });
});

router.get("/allAnouncements", Auth, async (req, res) => {
  const sentMessage = communicationsController.findAllAnouncements();
  const [err, data] = await asycnWrapper(sentMessage);
  if (err) return next(err);
  res.status(201).json({ status : 'success', data });
});

router.get("/DepartmentMessages/:Dep", Auth, async (req, res) => {
    const messages = communicationsController.findDepMessages(req.params.Dep);
    const [err, data] = await asycnWrapper(messages);
    if (err) return next(err);
    res.status(201).json({ status : 'success', data });
});

router.get( '/myMessage', Auth, async (req, res, next) => {  
  const messages = communicationsController.findMyMessage(req.user._id.toString());
  const [err, data] = await asycnWrapper(messages);
  if (err) return next(err);
  if(!data) 
    return res.status(400).json({status: "fail",message: `No Employee with ID ${req.params.Emp}`});
  res.status(201).json({ status: "success", data });
});

router.get( '/EmpolyeeMessages/:Emp', adminAuth, async (req, res, next) => {  
          const messages = communicationsController.findEmpMessages(req.params.Emp,req.user._id.toString());
          const [err, data] = await asycnWrapper(messages);
          if (err) return next(err);
          if(!data) 
            return res.status(400).json({status: "fail",message: `No Employee with ID ${req.params.Emp}`});
          res.status(201).json({ status: "success", data });
});


module.exports = router;
