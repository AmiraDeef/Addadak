const express=require("express");
const metricsRouter=express.Router();
const metricsController=require("../metricsController/metricsController");

metricsRouter.post("/addElectricMetric",metricsController.addMetrics)
metricsRouter.get("/getTier/:ID/:meterNo",metricsController.getTier);
metricsRouter.get("/viewAllTiers",metricsController.viewAllTiers);
metricsRouter.get("/viewAllMeters/:ID",metricsController.getAllMeters);
metricsRouter.get("/getUserConsumptions/:ID/:meterNo",metricsController.userConsumptions)


module.exports=metricsRouter;