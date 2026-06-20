const mongoose=require("mongoose");
const metricsSchema=require("../metricsModel/metricsModel");
const tiers=[
    {tier:1 ,min:0, max:50, rate:0.68},
    {tier:2 , min: 51, max: 100, rate: 0.78 },
    {tier:3 , min: 101, max: 200, rate: 0.95 },
    {tier:4 , min: 201, max: 350, rate: 1.55 },
    {tier:5 , min: 351, max: 650, rate: 1.95 },
    {tier:6 , min: 651, max: 1000, rate: 2.10 },
    {tier:7 , min: 1001, max: Infinity, rate: 2.58 }

];


const addMetrics=async(req,res)=>{
    try{
        const newMetrics=await metricsSchema.create(req.body);
        if(!newMetrics){res.status(400).json({message:"Invalid input Data please try again"})}
        res.status(201).json({newMetricsData:newMetrics});

    }
    catch(error){next(error)}
}

const getTier=async(req,res)=>{
    try{
        let usertier;
        let userRate;
        let userBill;
        const userID=req.params
        const userMeter=await metricsSchema.findOne({nationalID:userID}).sort({readingDate:-1});
        if(!userMeter){return res.status(404).json({message:"User metrics are not found!"})}
        for (const i=0; i<8 ;i++){
            if ((userMeter.lastRaeding>=tiers[i].min)&&(userMeter.lastRaeding<=tiers[i].max)){

                userBill=userMeter.lastReading*tiers[i].rate;
                usreRate=tiers[i].rate;
                userTier=tiers[i].tier;

            }
            break
        
        res.status(200).json({tier:userTier, bill:userBill, rate:userRate})}
    }catch(error){
        return next(error);
    }

}


module.exports={
    getTier
}