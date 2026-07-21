const express=require("express");
const router=express.Router()
const {chargeMeters,getWallet,getPaymentDetails}=require("../controllers/walletPayment.controller")
const authz=require("../middlewares/authzMiddleware")

router.post("/chargeMeters/:userNId/:meterNum",authz,chargeMeters)
router.get("/getwallet/:userNId",authz,getWallet)
router.get("/getPaymentDetails/:userNId/:meterNum",authz,getPaymentDetails)

module.exports = router;