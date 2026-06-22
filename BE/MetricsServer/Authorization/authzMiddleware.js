const jwt=require("jsonwebtoken");
const { isNamespaceExport } = require("typescript");

const authz=(req,res,next)=>{
    try{
        if(!req.headers.authorization)
            {res.status(401).json({message:"User not authorized to this action, please sign up"})}
        const token =req.headers.authorization.split(" ")[1];
        const decoded=jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            {res.status(401).json({message:"User not authorized to this action"})}
        }
        next();

    }catch(error){
        next(error);
    }
}


module.exports=authz;