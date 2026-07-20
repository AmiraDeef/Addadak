const express=require("express");
const router=express.Router()
const {chargeMeters,getWallet}=require("../controllers/walletPayment.controller")
const authz=require("../middlewares/authzMiddleware")

router.post("/chargeMeters/:userNId/:meterNum",authz,chargeMeters)
router.get("/getwallet/:userNId",authz,getWallet)
module.exports = router;