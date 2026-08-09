const mongoose = require("mongoose")
const walletSchema = require("../models/Wallet")
const metricsSchema = require("../models/metricsModel")
const user = require("../models/User")
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
//calc rate
const getRate = (cons) => {
    console.log(cons);

    if (cons < 0 || typeof cons !== "number") return 0
    const matchTier = tiers.find(tier => cons >= tier.min && cons <= tier.max);
    return matchTier ? matchTier.rate : 0;

}
//create payment stripe 
const createPaymentWay = async (amount,
    userNId,
    meter,
    userOfMet
) => {
    const payment = await stripe.paymentIntents.create({

        //convert to cents
        amount: Math.round(amount * 100),
        currency: "egp",

        metadata: {
            userNId: userNId,
            metricId: meter.meterNumber,
            meterType: meter.meterType,
            utility: meter.utility

        },

    })


    const paymentTransaction = await walletSchema.create({
        userId: userOfMet._id,
        meterId: meter._id,
        status: "pending",
        meterType: meter.meterType,
        amount: Number(amount.toFixed(2)),
        stripePaymentIntentId: payment.id

    })

    return {
        payment,
        paymentTransaction
    }

}


const chargeMeters = async (req, res, next) => {
    try {
        //get meternum w nid from request body or param 
        const { userNId, meterNum } = req.params;
        const { amount: bodyAmount } = req.body;

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
        const rawConsumption = consumptionTable[0]?.consumption || 0;
        const latestConsumption = Math.abs(rawConsumption);
        console.log(latestConsumption);


        // console.log(getRate(75)); 


        //calc consuption amount 
        const rate = getRate(latestConsumption);
        const amount = latestConsumption * rate;
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


        const userOfMet = await user.findOne({
            nationalID: userNId
        });

        if (!userOfMet) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        //check amount validation
        if (amount <= 0 || !amount) {
            return res.status(400).json({ message: "Amount must be greater than zero!" });
        }
       let finalAmount=0

        //type of meter  in 3 cases
        switch (meter.meterType) {
            case "Bill":
                const lastPay = await walletSchema.findOne({
                    meterId: meter._id,
                    status: "success"
                }).sort({ payingDate: -1 });

                if (lastPay) {
                    const nextDate = new Date(lastPay.payingDate)
                    nextDate.setDate(nextDate.getDate() + 30)

                    if (new Date() < nextDate) {

                        return res.status(400).json({
                            message: "Bill is already paid."
                        });

                    }
                }
                const billPayment = await createPaymentWay(
                    amount,
                    userNId,
                    meter,
                    userOfMet
                )
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 30);
                return res.status(200).json({

                    success: true,

                    clientSecret: billPayment.payment.client_secret,
                    transaction: billPayment.paymentTransaction,
                    dueDate: dueDate.toISOString().split('T')[0],
                    

                });



                break;

            case "Smart Card":


            //QR code simulation

                // const cardPayment = await createPaymentWay(
                //     amount,
                //     userNId,
                //     meter,
                //     userOfMet
                // );

                // return res.status(200).json({

                //     success: true,

                //     clientSecret: cardPayment.payment.client_secret,

                //     transaction: cardPayment.paymentTransaction

                // });
                 break;

            case "Smart Meter":
                finalAmount = Number(bodyAmount);
                if (!finalAmount || finalAmount <= 0||finalAmount<25) {
                    return res.status(400).json({ message: "Minimum charge amount for smart meters is 25 EGP." });}
            
            //user enter amount (in case it not autoPay ) in stipe window or app front
                const smartPayment = await createPaymentWay(
                    finalAmount,
                    userNId,
                    meter,
                    userOfMet
                );

                
                return res.status(200).json({

                    success: true,

                    clientSecret: smartPayment.payment.client_secret,

                    transaction: smartPayment.paymentTransaction

                });
                break;

            default:

                return res.status(400).json({
                    message: "Invalid meter type"
                });
        }





        //stripe create payment 

        const { payment, paymentTransaction } = await createPaymentWay(amount,
            userNId,
            meter,
            userOfMet)

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
        const { meterNum } = req.params;
        console.log(meterNum);

        const meter = await metricsSchema.findOne({ meterNumber: meterNum });
        if (!meter) {
            return res.status(404).json({ message: "Meter not found!" });
        }
        const walletTransactions = await walletSchema.find({ meterId: meter._id })
            .sort({ payingDate: -1 });

        return res.status(200).json({
            success: true,
            transactions: walletTransactions || []
        });

    } catch (error) {
        next(error)
    }
}

//user enable autopay
const enableAutopay = async (params) => {
    try {

    } catch (error) {

    }
}

//server-managed when autopay-->true
const autoPayProcess = async (req, res, next) => {
    try {
        //get all autopaymeters
        const autopayMeters = await metricsSchema.find({ autoPay: true })
        if (!autopayMeters || autopayMeters.length === 0) return res.status(200).json({ message: "no meters are autopay " })

        const succedMeters = []

        //calc amount for each meters

        // foreach not suitable with awit and axios


        // autopayMeters.forEach(met => {
        //     try {
        //         const ConsumptionMet = await axios.get(
        //             `${process.env.API_CONSUMPTION_URL}/${met.nationalID}/${met.meterNumber}`,
        //             {
        //                 headers: {
        //                     cookie: req.headers.cookie
        //                 }
        //             }
        //         )
        //         const consumptions = ConsumptionMet.data.consumptionTable;
        //         if (!consumptions || consumptions.length === 0) continue;

        //         const latestConsumption = consumptions[0].consumption;
        //         const rate = getRate(latestConsumption);
        //         const amount = latestConsumption * rate;

        //         if (amount <= 0) continue;






        // } catch (payError) {
        // console.error(`autopay faild for meter ${met.meterNumber}`);
        // await walletSchema.create({
        //         // userId: ,
        //         meterId: meter._id,
        //         status: "failed",
        //         meterType: meter.meterType,
        //         amount: 0,
        //         stripePaymentIntentId: "N/A"
        //     });


        // }
        // });



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
                utility: meter.utility,
                meterType: meter.meterType,
                address: meter.address,
                amount:Number( transaction.amount.toFixed(2)),
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
    enableAutopay,
    autoPayProcess,
    getPaymentDetails
}