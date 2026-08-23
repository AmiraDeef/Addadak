const mongoose = require("mongoose");
const walletSchema = require("../models/Wallet");
const metricsSchema = require("../models/metricsModel");
const user = require("../models/User");
const AutoPay = require("../models/AutoPay");
const stripe = require("stripe")(process.env.STRIP_SK);
const axios = require("axios");


// create payment stripe 
const createPaymentWay = async (
    amount,
    userNId,
    meter,
    userOfMet,
    isAutoPay = false,
    autoPayOptions = {}
) => {

    let customerId = autoPayOptions.customerId;

    // Manual payment
    if (!isAutoPay && !customerId) {
        const customer = await stripe.customers.create({
            description: `National ID: ${userNId}`,
            metadata: {
                userNId: userNId
            }
        });

        customerId = customer.id;
    }

    const paymentPayload = {
        amount: Math.round(amount * 100),
        currency: "egp",
        customer: customerId,

        metadata: {
            userNId: userNId,
            metricId: meter.meterNumber,
            meterType: meter.meterType,
            utility: meter.utility,
            paymentType: isAutoPay ? "AUTOPAY" : "MANUAL"
        }
    };

    // Manual payment
    if (!isAutoPay) {
        paymentPayload.setup_future_usage = "off_session";
    }

    // AutoPay payment
    if (isAutoPay) {

        if (
            !autoPayOptions.customerId ||
            !autoPayOptions.paymentMethodId
        ) {
            throw new Error(
                "Stripe Customer ID or Payment Method ID is missing for AutoPay"
            );
        }

        paymentPayload.payment_method =
            autoPayOptions.paymentMethodId;

        paymentPayload.off_session = true;
        paymentPayload.confirm = true;
    }

    const payment = await stripe.paymentIntents.create(
        paymentPayload
    );

    const isSuccess =
        payment.status === "succeeded";

    const paymentTransaction = await walletSchema.create({
        userId: userOfMet._id,
        meterId: meter._id,
        status: isSuccess ? "success" : "pending",
        meterType: meter.meterType,
        amount: Number(amount.toFixed(2)),
        stripePaymentIntentId: payment.id,
    });

    return {
        payment,
        paymentTransaction,
        customerId
    };
};

const chargeMeters = async (req, res, next) => {
    try {
        const { userNId, meterNum } = req.params;
  
        if (!userNId || !meterNum) {
            return res.status(400).json({ message: "National ID and Meter Number are required!" });
        }

        const consumptionRes = await axios.get(
            `${process.env.API_CONSUMPTION_URL}/${userNId}/${meterNum}`,
            {
                headers: {
                    cookie: req.headers.cookie
                }
            }
        );
        console.log("Consumption Data:", consumptionRes.data);

     const BillAmount = consumptionRes.data.rate * consumptionRes.data.consumptionInMonth;
console.log("BillAmount", BillAmount)
        

        const meter = await metricsSchema.findOne({ meterNumber: meterNum });
        if (!meter) {
            return res.status(404).json({ message: "Meter not found!" });
        }

        const userOfMet = await user.findOne({ nationalID: userNId });
        if (!userOfMet) {
            return res.status(404).json({ message: "User not found" });
        }

        let finalAmount = 0;

        switch (meter.meterType) {
            case "Bill":
                if (BillAmount <= 0 || !BillAmount) {
                    return res.status(400).json({ message: "Amount must be greater than zero!" });
                }

                const lastPay = await walletSchema.findOne({
                    meterId: meter._id,
                    status: "success"
                }).sort({ payingDate: -1 });

                if (lastPay) {
                    const nextDate = new Date(lastPay.payingDate);
                    nextDate.setDate(nextDate.getDate() + 30);

                    if (new Date() < nextDate) {
                        return res.status(400).json({ message: "Bill is already paid." });
                    }
                }

                const billPayment = await createPaymentWay(
                    BillAmount,
                    userNId,
                    meter,
                    userOfMet,
                    false
                );

                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 30);

                return res.status(200).json({
                    success: true,
                    clientSecret: billPayment.payment.client_secret,
                    transaction: billPayment.paymentTransaction,
                    dueDate: dueDate.toISOString().split('T')[0],
                });

            case "Smart Card":
                // QR code simulation
                break;

            case "Smart Meter":
                const{ amount: bodyAmount } = req.body;
                finalAmount = Number(bodyAmount);
                if (!finalAmount || finalAmount < 25) {
                    return res.status(400).json({ message: "Minimum charge amount for smart meters is 25 EGP." });
                }

                const smartPayment = await createPaymentWay(
                    finalAmount,
                    userNId,
                    meter,
                    userOfMet,
                    false
                );

                return res.status(200).json({
                    success: true,
                    clientSecret: smartPayment.payment.client_secret,
                    transaction: smartPayment.paymentTransaction
                });

            default:
                return res.status(400).json({ message: "Invalid meter type" });
        }
    } catch (error) {
        next(error);
    }
};

const getWallet = async (req, res, next) => {
    try {
        const { meterNum } = req.params;

        const meter = await metricsSchema.findOne({ meterNumber: meterNum });
        if (!meter) {
            return res.status(404).json({ message: "Meter not found!" });
        }

        const walletRecords = await walletSchema
            .find({ meterId: meter._id })
            .sort({ payingDate: -1 });

        const autoPaySetting = await AutoPay.findOne({ meterId: meter._id });

        return res.status(200).json({
            success: true,
            autoPay: autoPaySetting?.autoPay ?? false,
            autoPayAmount: autoPaySetting?.autoPayAmount ?? 100,
            transactions: walletRecords || []
        });

    } catch (error) {
        next(error);
    }
};

const enableAutopay = async (req, res, next) => {
    try {
        const { userNId, meterNum } = req.params;
        const { autoPay, amount } = req.body;

        if (!meterNum || !userNId) {
            return res.status(400).json({ message: "Meter number and National ID are required!" });
        }

        const meter = await metricsSchema.findOne({ meterNumber: meterNum });
        if (!meter) {
            return res.status(404).json({ message: "Meter not found!" });
        }

        const userOfMet = await user.findOne({ nationalID: userNId });
        if (!userOfMet) {
            return res.status(404).json({ message: "User not found!" });
        }

        const enabled = Boolean(autoPay);
        const parsedAmount = amount !== undefined && Number(amount) >= 25 ? Number(amount) : 100;

        const autoPaySetting = await AutoPay.findOneAndUpdate(
            { meterId: meter._id },
            {
                $set: {
                    userId: userOfMet._id,
                    meterId: meter._id,
                    autoPay: enabled,
                    autoPayAmount: enabled ? parsedAmount : 25
                }
            },
            {
                returnDocument: 'after',
                upsert: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            autoPay: autoPaySetting.autoPay,
            autoPayAmount: autoPaySetting.autoPayAmount,
            message: `AutoPay is now ${autoPaySetting.autoPay ? "enabled" : "disabled"}`
        });

    } catch (error) {
        next(error);
    }
};

const autoPayProcess = async (req, res, next) => {
    try {
        const { userNId, meterNum } = req.params;

        if (!meterNum || !userNId) {
            return res.status(400).json({ message: "meterNum and userNId are required!" });
        }

        const meter = await metricsSchema.findOne({ meterNumber: meterNum });
        if (!meter) return res.status(404).json({ message: "Meter not found!" });

       
        const autoPaySetting = await AutoPay.findOne({
            meterId: meter._id,
            autoPay: true
        });

        if (!autoPaySetting || autoPaySetting.autoPayAmount < 25) {
            return res.status(200).json({
                success: false,
                code: "AUTOPAY_DISABLED",
                message: "AutoPay is disabled or amount is less than 25 EGP."
            });
        }

        const userOfMet = await user.findOne({ nationalID: userNId });
        if (!userOfMet) return res.status(404).json({ message: "User not found!" });

  
        if (!autoPaySetting.stripeCustomerId || !autoPaySetting.stripePaymentMethodId) {
            return res.status(400).json({
                success: false,
                code: "NO_PAYMENT_METHOD",
                message: "No saved payment method found. Please make a manual payment first."
            });
        }


        const { payment, paymentTransaction } = await createPaymentWay(
            autoPaySetting.autoPayAmount,
            userNId,
            meter,
            userOfMet,
            true,
            {
                customerId: autoPaySetting.stripeCustomerId,
                paymentMethodId: autoPaySetting.stripePaymentMethodId
            }
        );

        return res.status(200).json({
            success: true,
            code: "AUTOPAY_SUCCESS",
            message: "AutoPay transaction processed successfully.",
            clientSecret: payment.client_secret,
            transaction: paymentTransaction
        });

    } catch (error) {
        next(error);
    }
};

const getPaymentDetails = async (req, res, next) => {
    try {
        const { userNId, meterNum } = req.params;
        if (!userNId || !meterNum) {
            return res.status(400).json({ message: "National ID and Meter Number are required!" });
        }

        const meter = await metricsSchema.findOne({ meterNumber: meterNum });
        if (!meter) {
            return res.status(404).json({ message: "Meter details not found!" });
        }

        const transaction = await walletSchema.findOne({ meterId: meter._id }).sort({ payingDate: -1 });
        if (!transaction) {
            return res.status(404).json({ message: "No transaction history found for this meter!" });
        }

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
                amount: Number(transaction.amount.toFixed(2)),
                status: transaction.status,
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    chargeMeters,
    getWallet,
    enableAutopay,
    autoPayProcess,
    getPaymentDetails
};