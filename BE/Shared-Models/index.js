const userSchema=require('./models/User')
const metricsSchema=require('./models//metricsModel')
const walletSchema=require('./models/Wallet')
module.exports=(mongooseInstance)=>{
    return{
        user:mongooseInstance.model("User",userSchema),
        metricsSchema:mongooseInstance.model("Metrics",metricsSchema),
        walletSchema:mongooseInstance.model("Wallet",walletSchema),
        

    }
};