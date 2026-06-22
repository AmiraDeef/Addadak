const express=require("express");
const metricsRouter=express.Router();
const metricsController=require("../metricsController/metricsController");

metricsRouter.post("/addElectricMetric",metricsController.addMetrics)
metricsRouter.get("/getTier/:ID",metricsController.getTier);

module.exports=metricsRouter;