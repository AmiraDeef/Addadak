const mongoose = require("mongoose")
const { walletSchema, metricsSchema } = require("addadak-db-models")(mongoose);
const stripe = require("stripe")(process.env.STRIP_SK);
const axios = require("axios");


const chargeMeters = async (req, res, next) => {
    try {
        //get meternum w nid from request body or param 
        const { userNId, meterNum } = req.params;

        if (!userNId || !meterNum) {
            return res.status(400).json({ message: "National ID and Meter Number are required!" });
        }

        //adding autopay value when added

        // console.log(req.headers.cookie);

        //get consumption,amount from axios endpoint userconsumption
        const consumptionRes = await axios.get(
            `${process.env.API_CONSUMPTION_URL}/${userNId}/${meterNum}`,
            {
                headers: {
                    cookie: req.headers.cookie
                }
            }
        );
        //   handle res of array of consuptions
        console.log(consumptionRes.data.consumptionTable)
        const consumptionTable = consumptionRes.data.consumptionTable;
        const latestConsumption = consumptionTable[0].consumption;
        console.log(latestConsumption);
        if (!meterNum) {
            return res.status(400).json({ message: "Meter Number is required!" });
        }
        console.log({ walletSchema, metricsSchema });

        //check if meter exist
        const meter = await metricsSchema.findById(meterId);
        if (!meter) {
            return res.status(404).json({ message: "Meter not found!" });
        }
        //check amount validation
        if (amount <= 0 || !amount) {
            return res.status(400).json({ message: "Amount must be greater than zero!" });
        }

        //type of meter  

        if (meter.meterType === "Bill") {
            //sara code
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


        // store in db 
        const paymentTransaction = await walletSchema.create({
            userId: userId,
            meterId: meterId,
            status: "pending",
            meterType: meter.meterType,
            amount: amount,
            stripePaymentIntentId: payment.id

        })


        return res.status(200).json({
            success: true,
            clientSecret: payment.client_secret,
            transaction: paymentTransaction
        });


    } catch (error) {
        next(error)
    }

}

const getWallet = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const walletTransactions = await walletSchema.find({ userId: userId }).sort({ createdAt: -1 });
        if (!walletTransactions || walletTransactions.length === 0) {
            return res.status(404).json({ message: "No wallet transactions found for this user!" });
        }

        return res.status(200).json({
            success: true,
            transactions: walletTransactions
        });

    } catch (error) {
        next(error)
    }
}



const autoPay = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}









module.exports = {
    chargeMeters,
    getWallet,
    autoPay
}