const express=require("express");
const router=express.Router()
const {chargeMeters}=require("../controllers/walletPayment.controller")
const authz=require("../middlewares/authzMiddleware")

router.post("/chargeMeters",authz,chargeMeters)
module.exports = router;