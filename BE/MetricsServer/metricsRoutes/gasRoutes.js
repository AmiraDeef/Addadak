const express = require('express');
const metricsRouter = express.Router();

const{
    viewAllTiers,
    getAllGasMeters,
    getInvoice,
    getGasMonthlyHistoryConsumption,
    getcurrentMonthSmartConsumption
} = require("../metricsController/gasController");
const authz = require('../Authorization/authzMiddleware');

metricsRouter.get("/viewAllTiers", viewAllTiers);


//metricsRouter.use(authz)

metricsRouter.get("/getTier/:meterNo",getInvoice)//We don't need the ID parameter here and we need to change the url name...
metricsRouter.get("/viewAllMeters/:ID",getAllGasMeters);
metricsRouter.get("/getUserConsumptions/:meterNo",getGasMonthlyHistoryConsumption);
metricsRouter.get("/getcurrentMonthSmartConsumption/:meterNo",getcurrentMonthSmartConsumption);

module.exports = metricsRouter;