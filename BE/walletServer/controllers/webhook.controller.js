const stripe = require("stripe")(process.env.STRIP_SK);
const walletSchema = require("../models/Wallet");
const AutoPay = require("../models/AutoPay");

const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook Signature Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {

                const paymentIntent = event.data.object;

                const customerId = paymentIntent.customer;
                const paymentMethodId = paymentIntent.payment_method;

                const updatedTransaction =
                    await walletSchema.findOneAndUpdate(
                        {
                            stripePaymentIntentId: paymentIntent.id
                        },
                        {
                            $set: {
                                status: "success",
                                payingDate: new Date()
                            }
                        },
                        {
                            new: true
                        }
                    );

                if (!updatedTransaction) {
                    console.warn(
                        `Transaction not found: ${paymentIntent.id}`
                    );
                    break;
                }

                console.log("Payment succeeded");
                console.log("Customer:", customerId);
                console.log("Payment Method:", paymentMethodId);

                // Save Stripe information for AutoPay
                if (customerId && paymentMethodId) {

                    await AutoPay.findOneAndUpdate(
                        {
                            userId: updatedTransaction.userId,
                            meterId: updatedTransaction.meterId
                        },
                        {
                            $set: {
                                stripeCustomerId: customerId,
                                stripePaymentMethodId: paymentMethodId
                            }
                        },
                        {
                            upsert: false
                        }
                    );
                }

                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;

                await walletSchema.findOneAndUpdate(
                    { stripePaymentIntentId: paymentIntent.id },
                    { $set: { status: "failed" } }
                );

                console.warn(`Payment failed for Intent ID: ${paymentIntent.id}`);
                break;
            }

            case "charge.failed": {
                const charge = event.data.object;

                if (charge.payment_intent) {
                    await walletSchema.findOneAndUpdate(
                        { stripePaymentIntentId: charge.payment_intent },
                        { $set: { status: "failed" } }
                    );
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return res.status(200).json({ received: true });
    } catch (dbError) {
        console.error(`Database error during webhook handling: ${dbError.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    stripeWebhook,
};