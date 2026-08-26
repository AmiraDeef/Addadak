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