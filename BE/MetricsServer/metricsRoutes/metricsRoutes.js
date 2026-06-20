const express=rerquire("express");
const metricsRouter=express.Router();
const metricsController=require("../metricsController/metricsController");

metricsRouter.post("/logged/user/electricMetric",metricsController)
metricsRouter.get("/logged/user/electricMetric/:_id",metricsController.getTier);
