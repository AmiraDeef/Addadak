const express=require("express");
const router=express.Router()
const {chargeMeters,getWallet,getPaymentDetails,enableAutopay,autoPayProcess}=require("../controllers/walletPayment.controller")
const authz=require("../middlewares/authzMiddleware")

router.post("/chargeMeters/:userNId/:meterNum",chargeMeters)
router.get("/getwallet/:meterNum",getWallet)
router.get("/getPaymentDetails/:userNId/:meterNum",getPaymentDetails)
router.patch("/enableAutopay/:userNId/:meterNum",enableAutopay)


router.post("/autopay/process/:userNId/:meterNum", autoPayProcess);

module.exports = router;