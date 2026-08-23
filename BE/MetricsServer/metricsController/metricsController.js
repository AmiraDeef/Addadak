const mongoose=require("mongoose");
const {metricsSchema}=require("addadak-db-models")(mongoose);
const tiers=[
    {tier:1 ,min:0, max:50, rate:0.68},
    {tier:2 , min: 51, max: 100, rate: 0.78 },
    {tier:3 , min: 101, max: 200, rate: 0.95},
    {tier:4 , min: 201, max: 350, rate: 1.55 },
    {tier:5 , min: 351, max: 650, rate: 1.95 },
    {tier:6 , min: 651, max: 1000, rate: 2.10 },
    {tier:7 , min: 1001, max: Infinity, rate: 2.58 }

]



const viewAllTiers=(req,res,next)=>{
    try{

        res.status(200).json({Tiers:tiers})

    }catch(error){
        next(error);
    }
}



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

const getAllMeters=async(req,res,next)=>{
    try{
         const {ID}=req.params;
         const userMeters=await metricsSchema.aggregate([
            {
                $match:{nationalID:ID},
            },
            {
                $group:{
                    _id:{
                        meterType:"$meterType",
                        meterNumber:"$meterNumber",
                        address:"$address",
                        utility:"$utility"

                    }
                     
                }
            }
         ])
         if(!userMeters || userMeters.length === 0){return res.status(404).json({message:"User metrics are not found!"})}
         res.status(200).json({message :"All meters",
            meters:userMeters
           
        });
    }catch(error){
        next(error);
    }
}

const getTier=async(req,res,next)=>{
    try{
        const {ID,meterNo}=req.params
        
        const userMeters=await metricsSchema.find({nationalID:ID,meterNumber:meterNo}).sort({readingDate:-1})
        console.log(userMeters)
        if(!userMeters || userMeters.length === 0){return res.status(404).json({message:"User metrics are not found!"})}
    
        const latestUserMeter=userMeters[0]
        let userMeter=0
        let userTier=1;
        let userRate=0;
        if(latestUserMeter.meterType==="Bill"){
            userMeter=latestUserMeter.reading-userMeters[1].reading;
        }else if(latestUserMeter.meterType==="Smart Card")
        {
            const currentMonthRecords=userMeters.filter(ele=>ele.billingMonth===latestUserMeter.billingMonth);
            if(currentMonthRecords.length>1){
                const oldestRecordInCurrentMonth=currentMonthRecords[currentMonthRecords.length-1];
                userMeter=latestUserMeter.reading-oldestRecordInCurrentMonth.reading
            }else{
                userMeter=latestUserMeter.reading-userMeters[1].reading;
            }
        }

        for (let i = 0; i < tiers.length; i++) {
            if (userMeter >= tiers[i].min && userMeter <= tiers[i].max) {
                userTier = tiers[i].tier;
                userRate=tiers[i].rate;
                break;
            }
        }

        res.status(200).json({ 
            message: "tier is", 
            tier: userTier, 
            rate:userRate,
            consumptionInMonth: userMeter 
        });

    }catch(error){
         next(error);
    }

}

const userConsumptions=async(req,res,next)=>{
    try{
        const {ID,meterNo}=req.params
        
        const userMeters=await metricsSchema.find({nationalID:ID,meterNumber:meterNo}).sort({readingDate:-1})
        console.log(userMeters)
        if(!userMeters || userMeters.length === 0){return res.status(404).json({message:"User metrics are not found!"})}
        const consumptions=[];
        for (let i = 0; i < userMeters.length; i++) {
            let currentConsumption = 0;

            
            if (userMeters[i + 1]) {
                currentConsumption = userMeters[i].reading - userMeters[i + 1].reading;
            } else {
                
                currentConsumption = userMeters[i].reading-0;
                if(currentConsumption<0){
                    currentConsumption=Math.abs(currentConsumption)
                }
            }

            consumptions.push({
                month: userMeters[i].billingMonth,
                consumption: currentConsumption
            });
        }

        res.status(200).json({ 
            success: true,
            message: "consumptions fetched successfully", 
            consumptionTable: consumptions 
        });
    }catch(error){
        next(error);
    }
}
 
const deleteUserMeters=async(req,res,next)=>{
    try{
        const {ID}=req.params
        
        const result=await metricsSchema.deleteMany({nationalID:ID})
        console.log(userMeters)
        if (result.deletedCount === 0){return res.status(404).json({message:"User metrics are not found!"})}
        res.status(200).json({ 
            success: true,
            message: "user deleted ", 
        });
    }catch(error){
        next(error);
    }
}


module.exports={
    getTier,
    addMetrics,
    viewAllTiers,
    getAllMeters,
    userConsumptions,
    deleteUserMeters
}