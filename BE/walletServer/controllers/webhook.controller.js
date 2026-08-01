const stripe = require("stripe")(process.env.STRIP_SK);
const walletSchema = require("../models/Wallet");

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
        console.log(err.message);

        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case "payment_intent.succeeded": {

            const paymentIntent = event.data.object;

            const transaction =
                await walletSchema.findOne({
                    stripePaymentIntentId: paymentIntent.id
                });

            if (!transaction) break;

            transaction.status = "success";

            await transaction.save();


            console.log("Meter Charged Successfully");

            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;

            const transaction =
                await walletSchema.findOne({
                    stripePaymentIntentId: paymentIntent.id
                });

            if (transaction) {

                transaction.status = "failed";

                await transaction.save();

            }

            break;
        }

        default:
            console.log(`Unhandled event ${event.type}`);
    }

    res.json({ received: true });
};

module.exports = {
    stripeWebhook,
};