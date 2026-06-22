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


const addMetrics=async(req,res,next)=>{
    try{
        if(req.body.meterType==="Bill"){
            const userExist=await metricsSchema.findOne({
                nationalID:req.body.nationalID,
                meterNumber:req.body.meterNumber,
                billingMonth:req.body.billingMonth
            });
            if(userExist){return res.status(400).json({message:"The billing of this month for this meter is already captured!"})}
            
            const newMetrics=await metricsSchema.create(req.body);
            if(!newMetrics){ return res.status(400).json({message:"Invalid input Data please try again"})}
            res.status(201).json({newMetricsData:newMetrics});
        }else
        {
            const newMetrics=await metricsSchema.create(req.body);
            if(!newMetrics){res.status(400).json({message:"Invalid input Data please try again"})}
            res.status(201).json({newMetricsData:newMetrics});
        }

    }
    catch(error){
        next(error)
    }
}

const getTier=async(req,res,next)=>{
    try{
        let userTier;
        let userRate;
        let userBill;
        const {ID}=req.params
        
        const userMeters=await metricsSchema.find({nationalID:ID}).sort({readingDate:-1});
        if(!userMeters || userMeters.length === 0){return res.status(404).json({message:"User metrics are not found!"})}
    
        const userMeter=userMeters[0].reading-userMeters[1].reading;
        for (let i=0; i<tiers.length ;i++){
            if ((userMeter>=tiers[i].min)&&(userMeter<=tiers[i].max)){

                userRate=tiers[i].rate;
                userTier=tiers[i].tier;
                break;
            }
        }
        console.log(userMeter);
        userBill=parseFloat((userMeter*userRate).toFixed(2));
        res.status(200).json({message :"tier is",
            currentMonth:{tier:userTier, rate:userRate, bill:userBill},
            lastMonths:userMeters
        });
    }catch(error){
         next(error);
    }

}


module.exports={
    getTier,
    addMetrics
}