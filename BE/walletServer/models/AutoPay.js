const mongoose = require("mongoose");

const autoPaySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        meterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Metrics",
            required: true,
            unique: true,
        },

        autoPay: {
            type: Boolean,
            default: false,
        },

        autoPayAmount: {
            type: Number,
            default: 100,
            min: 25,
        },

        stripeCustomerId: {
            type: String,
            default: null,
        },

        stripePaymentMethodId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AutoPay", autoPaySchema);