const express = require('express');
const metricsRouter = express.Router();
const {
    viewAllTiers,
    getAllElectricityMeters,
    getInvoice,
    getElectricityMonthlyHistoryConsumption,
    getcurrentMonthSmartConsumption
} = require("../metricsController/electricityController");
const authz = require('../Authorization/authzMiddleware');


metricsRouter.get("/viewAllTiers",viewAllTiers);

metricsRouter.use(authz);

metricsRouter.get("/getTier/:ID/:meterNo",getInvoice)//We don't need the ID parameter here and we need to change the url name...
metricsRouter.get("/viewAllMeters/:ID",getAllElectricityMeters);
metricsRouter.get("/getUserConsumptions/:meterNo",getElectricityMonthlyHistoryConsumption);
metricsRouter.get("/getcurrentMonthSmartConsumption/:meterNo",getcurrentMonthSmartConsumption);

module.exports = metricsRouter;