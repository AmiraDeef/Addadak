//require jwt
const jwt=require("jsonwebtoken");

//build middleware
const authZmiddleware=(req,res,next)=>{
    //expand the req to get the token from header
    try{
        if(!req.headers.authorization){res.status(401).json({msg:"You don't have an account, Please sign up first."})}
        console.log(req.headers);
        const token=req.headers.authorization.split(" ")[1];
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        next();
    }catch(err){next(err)}
//req.cookies.Authtoken
}

//export middleware
module.exports=authZmiddleware;