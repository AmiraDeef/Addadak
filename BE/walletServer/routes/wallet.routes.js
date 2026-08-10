const express=require("express");
const router=express.Router()
const {chargeMeters,getWallet,getPaymentDetails,enableAutopay,autoPayProcess}=require("../controllers/walletPayment.controller")
const authz=require("../middlewares/authzMiddleware")

router.post("/chargeMeters/:userNId/:meterNum",authz,chargeMeters)
router.get("/getwallet/:meterNum",authz,getWallet)
router.get("/getPaymentDetails/:userNId/:meterNum",authz,getPaymentDetails)
router.patch("/enableAutopay/:userNId/:meterNum",authz,enableAutopay)


router.post("/autopay/process/:userNId/:meterNum", autoPayProcess);

module.exports = router;