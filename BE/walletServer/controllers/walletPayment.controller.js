const mongoose = require("mongoose")
const { Wallet, Metrics } = require("addadak-db-models")(mongoose);
const stripe = require("stripe")(process.env.STRIP_SK);



const chargeMeters = async (req, res, next) => {
    try {
        //get meterid,amount
        const { meterId, amount } = req.body;
        if (!meterId || !amount) {
            return res.status(400).json({ message: "Meter ID and amount are required!" });
        }
 
        //check if meter exist
        const meter = await Metrics.findById(meterId);
        if (!meter) {
            return res.status(404).json({ message: "Meter not found!" });
        }
        //check amount validation
        if (amount <= 0 || !amount) {
            return res.status(400).json({ message: "Amount must be greater than zero!" });
        }

        //type of meter
        if (meter.meterType === "Bill") {
            return res.status(400).json({ message: "This route is only for Smart Cards and Smart Meters!" });
        }



        //stripe create payment 
        const payment = await stripe.paymentIntents.create({

            //convert to cents
            amount: Math.round(amount * 100),
            currency: "egp",
        
            metadata: {
                metricId: meterId.toString(),
                meterType: meter.meterType
            },

        })


        //store in db 
        const paymentTransaction =await Wallet.create({
            meterId: meterId,
            status: "pending",
            amount: amount,
            stripePaymentId: payment.id

        })


    } catch (error) {
        next(error)
    }

}


module.exports = {
    chargeMeters
}