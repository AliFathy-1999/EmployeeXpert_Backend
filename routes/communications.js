const express = require("express");
const router = express.Router();
const { communicationsController } = require("../controllers/index");
const { validate } = require("../middlewares/validation");
const { message } = require("../Validations/communications");
const Employee = require("../DB/models/employee");
const Department = require("../DB/models/department");
const { AppError, asycnWrapper } = require("../lib/index");
const { adminAuth, Auth } = require("../middlewares/auth");


router.post('/toemployee', adminAuth, validate(message), async (req, res, next) => {
    const { body: { title, message, employee } } = req;
      const sender = (req.user._id).toString();
      const sentMessage = communicationsController.create({ title, message, employee : employee.toString() , sender : sender.toString()});
      console.log(sentMessage)
      const [err, data] = await asycnWrapper(sentMessage);
      if (err) return next(err);
      console.log("data =>" ,data)
      res.status(201).json({ status : 'success', data });
  });


router.post('/todepartment', adminAuth, validate(message), async (req, res, next) => {
      const { body: { title, department, message } } = req;
      const sender = (req.user._id).toString();
      const sentMessage = communicationsController.create({ department, sender, title, message});
      const [err, data] = await asycnWrapper(sentMessage);
      if (err) return next(err);
      res.status(201).json({ status : 'success', data });
});

router.post("/toall", adminAuth, validate(message), async (req, res, next) => {
  if (req.body.isForAll) {
    const {
      body: { isForAll,title, message },
    } = req;
    const sender = req.user._id;
    const sentMessage = communicationsController.create({
      isForAll,
      sender: sender.toString(),
      title,
      message,
    });
    const [err, data] = await asycnWrapper(sentMessage);

    if (err) return next(err);
    res.status(201).json({ status: "success", data });
  } else {
    res.status(400).json({ status: "failed", data: "All is required" });
  }
});

router.get("/lastAnouncement", Auth, async (req, res) => {
  try {
    data = await communicationsController.findLastAouncement();
    res.status(201).json({ status: "success", data });
  } catch (erorr) {
    res.status(400).json({ status: "failed", data: "no anouncements found" });
  }
});

router.get("/allAnouncements", Auth, async (req, res) => {
  try {
    data = await communicationsController.findAllAnouncements();
    res.status(201).json({ status: "success", data });
  } catch (erorr) {
    res.status(400).json({ status: "failed", data: "no anouncements found" });
  }
});

router.get("/DepartmentMessages/:Dep", Auth, async (req, res) => {
  try {
    data = await communicationsController.findDepMessages(req.params.Dep);
    res.status(201).json({ status: "success", data });
  } catch (erorr) {
    res.status(400).json({ status: "failed", data: "not found this dep" });
  }
});

router.get( '/myMessages', Auth, async (req, res , next) => {
    try {
     
      data = await communicationsController.findMyMessages(

        req.user._id.toString()
      );
      res.status(201).json({ status: "success", data });
    } catch (error) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: `No Employee with ID ${req.params.Emp}`,
        });
    }})

    router.get( '/EmpolyeeMessages/:Emp', adminAuth , async (req, res , next) => {
        try {    
          data = await communicationsController.findEmpMessages(
            req.params.Emp,
            req.user._id.toString()
          );
          res.status(201).json({ status: "success", data });
        } catch (error) {
          return res
            .status(400)
            .json({
              status: "fail",
              message: `No Employee with ID ${req.params.Emp}`,
            });
        }
});
// });

module.exports = router;
