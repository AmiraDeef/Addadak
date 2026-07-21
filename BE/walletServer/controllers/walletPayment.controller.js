const mongoose = require("mongoose")
const { walletSchema, metricsSchema } = require("addadak-db-models")(mongoose);
const stripe = require("stripe")(process.env.STRIP_SK);
const axios = require("axios");

const tiers = [
    { tier: 1, min: 0, max: 50, rate: 0.68 },
    { tier: 2, min: 51, max: 100, rate: 0.78 },
    { tier: 3, min: 101, max: 200, rate: 0.95 },
    { tier: 4, min: 201, max: 350, rate: 1.55 },
    { tier: 5, min: 351, max: 650, rate: 1.95 },
    { tier: 6, min: 651, max: 1000, rate: 2.10 },
    { tier: 7, min: 1001, max: Infinity, rate: 2.58 }

]

const getRate = (cons) => {
    if (cons < 0 || typeof cons !== "number") return 0
    const matchTier = tiers.find(tier => cons >= tier.min && cons <= tier.max);
    return matchTier ? matchTier.rate : 0;


}
console.log(getRate(75)); // Output: 0.78
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


        console.log(getRate(75)); // Output: 0.78


        //calc consuption amount 
        const rate = getRate(latestConsumption);
        const amount = latestConsumption * rate; // Assuming 0.5 EGP per unit of consumption
        console.log({ rate, amount });
        if (!meterNum) {
            return res.status(400).json({ message: "Meter Number is required!" });
        }
        // console.log({ walletSchema, metricsSchema });

        //check if meter exist
        const meter = await metricsSchema.findOne({ meterNumber: meterNum });
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
                userNId: userNId,
                metricId: meter.meterNumber,
                meterType: meter.meterType,
                // utility: meter.utility

            },

        })
        console.log(meter.user);
        // store in db 
        const paymentTransaction = await walletSchema.create({
            userId: meter.user,
            meterId: meter._id,
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


const getPaymentDetails = async (req, res, next) => {
    try {
        //getting userNId and meterNum from params
        const { userNId, meterNum } = req.params;
        if (!userNId || !meterNum) {
            return res.status(400).json({ message: "National ID and Meter Number are required!" });
        }
    //get meter to collect data
        const meter = await metricsSchema.findOne({ meterNumber: meterNum });
        if (!meter) {
            return res.status(404).json({ message: "Meter details not found!" });
        }
        
     //get latest payment transaction
        const transaction = await walletSchema.findOne({
            meterId: meter._id
        }).sort({ payingDate: -1 });
        if (!transaction) {
            return res.status(404).json({ message: "No transaction history found for this meter!" });
        }
        console.log(transaction);

        // print all details of this meter its invoices
        return res.status(200).json({
            success: true,
            transaction: {
                transactionId: transaction._id,
                stripePaymentIntentId: transaction.stripePaymentIntentId,
                nationalID: userNId,
                meterNumber: meter.meterNumber,
                meterType: meter.meterType,
                address: meter.address,
                amount: transaction.amount,
                status: transaction.status,
                
            }
        });

    } catch (error) {
        next(error)
    }
}







module.exports = {
    chargeMeters,
    getWallet,
    autoPay,
    getPaymentDetails
}