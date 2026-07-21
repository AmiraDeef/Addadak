const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
  
    meterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Metrics",
        required: true
    }, meterType: {
        type: String,
        enum: ["Bill", "Smart Card", "Smart Meter"], 
        required: true
    } ,
    amount:{
        type:Number,
        required:true
    },
    stripePaymentIntentId: {
        type: String,
        required: true
    },
    status:{
        type:String,
        enum:["pending","paid","failed"],
        default: "pending"
    },
    autoPay: {
        type: Boolean,
        default: false
    },
     payingDate: { type: mongoose.Schema.Types.Date, default: Date.now }
})

module.exports=walletSchema;
