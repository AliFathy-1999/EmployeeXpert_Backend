
const express = require('express');
const router = express.Router();
const { communicationsController } = require('../controllers/index');
router.post("/toemployee",async(req,res)=>{
data  = req.body
console.log(data)
res.status(201).json({ status:'success', data });
})

router.post("/todepartment",async(req,res)=>{
    data  = req.body
    console.log(data)
    res.status(201).json({ status:'success', data });
})

router.post("/toall",async(req,res)=>{
    data  = req.body
    console.log(data)
    res.status(201).json({ status:'success', data }); 
})

module.exports = router;