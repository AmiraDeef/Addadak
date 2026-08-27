const express = require('express');
const metricsRouter = express.Router();

const{
    viewAllTiers,
    getAllWaterMeters,
    getInvoice,
    getWaterMonthlyHistoryConsumption,
    getcurrentMonthSmartConsumption
} = require('../metricsController/waterController');

const authz = require('../Authorization/authzMiddleware')

metricsRouter.get("/viewAllTiers",viewAllTiers);

//metricsRouter.use(authz);

metricsRouter.get("/getTier/:meterNo",getInvoice)//We don't need the ID parameter here and we need to change the url name...
metricsRouter.get("/viewAllMeters/:ID",getAllWaterMeters);
metricsRouter.get("/getUserConsumptions/:meterNo",getWaterMonthlyHistoryConsumption);
metricsRouter.get("/getcurrentMonthSmartConsumption/:meterNo",getcurrentMonthSmartConsumption);

module.exports = metricsRouter;