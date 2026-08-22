const mongoose = require("mongoose");

//we need to add utility type feild and we need to add indexing ...A3
const metricsSchema=mongoose.Schema({
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
   billingMonth: 
   { type: String,
      required: true, 
      index:true
    }, 
   reading: { type: Number, required: true },

   readingDate: { type: mongoose.Schema.Types.Date, default: Date.now },
});

metricsSchema.index({ meterNumber: 1, readingDate: -1 });// to enhance an increase the speed of the search 
module.exports=mongoose.model("Metrics",metricsSchema);