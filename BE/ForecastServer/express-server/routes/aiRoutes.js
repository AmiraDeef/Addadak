const express=require("express");
const router=express.Router();

const aiController=require("../controllers/aiController")

router.get("/predict/:nationalID/:utility/:meterNumber",aiController.predictNextMonth);

module.exports=router;