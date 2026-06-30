const express=require("express");
const metricsRouter=express.Router();
const metricsController=require("../metricsController/metricsController");
const authz=require("../Authorization/authzMiddleware")

metricsRouter.post("/addElectricMetric",metricsController.addMetrics)
metricsRouter.get("/getTier/:ID/:meterNo",authz,metricsController.getTier);
metricsRouter.get("/viewAllTiers",metricsController.viewAllTiers);
metricsRouter.get("/viewAllMeters/:ID",authz,metricsController.getAllMeters);
metricsRouter.delete("/deleteAllMeters/:ID",authz,metricsController.deleteUserMeters);
metricsRouter.get("/getUserConsumptions/:ID/:meterNo",authz,metricsController.userConsumptions);


module.exports=metricsRouter;