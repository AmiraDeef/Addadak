const userSchema=require('./models/User')
const metricsSchema=require('./models/metricsModel')
module.exports=(mongooseInstance)=>{
    return{
        user:mongooseInstance.model("User",userSchema),
        metricsSchema:mongooseInstance.model("Metrics",metricsSchema),
        

    }
};