//require jwt
const jwt=require("jsonwebtoken");

//generate token 
const generateToken=(id,phone,secret,exp)=>{
    const payload={id,phone}
    const token=jwt.sign(payload,secret,{expiresIn:exp});
    return token;
}

//export
module.exports=generateToken;