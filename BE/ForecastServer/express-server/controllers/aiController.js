const mongoose=require("mongoose");
const axios =require("axios");
const {metricsSchema}=require("addadak-db-models")(mongoose);

const python_endpoints={
    Electricity: 'http://localhost:8000/predict/Electricity',
    Water: 'http://localhost:8000/predict/Water',
    Gas: 'http://localhost:8000/predict/Gas'
}

const predictNextMonth=async(req,res,next)=>{
    try{
        const {nationalID, utility, meterNumber}=req.params;
        if(!python_endpoints[utility])return res.status(400).json({message:"unsupported utility"});

        const histories= await metricsSchema.find({nationalID, utility, meterNumber}).sort({billingMonth:-1}).limit(6);
        if (!histories || histories.length === 0) 
            {return res.status(404).json({ message: "No previous consumptions to forecast" });}
        const history=histories.reverse();
        const meterType=history[0].meterType;
        const previousValues = history.map(item => item.reading);
        const lastRecordDate = new Date(history[history.length-1].billingMonth);
        const lastMonthInDB = lastRecordDate.getMonth() + 1;
        const predictionMonth = (lastMonthInDB % 12) + 1;
        console.log(history);
        const pythonResponse = await axios.post(python_endpoints[utility], {
        features: {
            month: predictionMonth, 
            meter_type: meterType,
            previous_consumption: previousValues
        }
    });
    
    console.log(lastMonthInDB);
    console.log(predictionMonth);
    return res.status(200).json({
      success: true,
      calculatedForMonth: predictionMonth, 
      prediction: pythonResponse.data.prediction
        })
    }catch(error){
        next(error)
    }
}

module.exports={
    predictNextMonth
}