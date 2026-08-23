/* this is the formate which the data is sent to the Electricity company:
this is the smart meter reading
{
  "meterNumber": "1002938475",
  "utilityType": "Electricity",
  "meterType": "SMART",
  "readings": {
    "cumulativeKwh": 1250.75,
    "instantaneousVoltage": 220.4,
    "currentAmperage": 12.5,
    "powerFactor": 0.95
  },
  "balance": {
    "remainingCreditEgp": 145.50,
    "currentTariffSlice": 3
  },
  "status": {
    "tamperDetected": false,
    "powerConnected": true
  },
  "timestamp": "2026-08-02T18:45:00Z"

#this is the reading of Prepaid Smart Card / Coded Meter)
  {
  "meterNumber": "9876543210",
  "utilityType": "Electricity",
  "meterType": "PREPAID_CARD",
  "cardTransaction": {
    "transactionId": "TXN-8849201",
    "rechargeAmountEgp": 200.00,
    "remainingCreditBeforeRecharge": 12.30,
    "lastReadingKwh": 840.00,
    "tariffSliceAtRecharge": 2
  },
  "syncChannel": "MOBILE_NFC", // أو POS_TERMINAL
  "timestamp": "2026-08-02T14:10:00Z"
}
}

we can adjust these reading and its logic after descussion.
   */


const { match } = require("assert");
const mongoose=require("mongoose");


const metricSchema=new mongoose.Schema({
   nationalID:{type:String,
        match:[/^([23])(?:\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?:\d{7})$/,"Please enter a valid Egyptian National ID."],
        required:true
   },
   utility:{
      type:String,
      required:true,
      enum:["Electricity", "Water", "Gas"],
      trim:true
   },

   meterNumber:{
    type:String,
    required:true,
    match:[/^\d{10}$/,"Invalid Meter Number, please enter it in the right format"],
    trim:true
   },
   meterType:{
    type:String,
    enum:["Smart Meter", "Smart Card" ,"Bill"],
    required:true,
    default:"Smart Card"
   },
   address: { 
    type: String, 
    required: true 
   },
   billingMonth: {
    type: String,
    required: true,
    set: function (val) {
      
      const [year, month] = val.split('-');
      const paddedMonth = month.padStart(2, '0'); 
      return `${year}-${paddedMonth}`;
    },
    index:true
  },
   reading: { type: Number, required: true },

   readingDate: { type: mongoose.Schema.Types.Date, default: Date.now },
});

const metricsSchema=mongoose.model("metrics",metricSchema);

module.exports=metricsSchema;

