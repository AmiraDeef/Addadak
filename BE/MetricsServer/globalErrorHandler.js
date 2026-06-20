const serverErrorHandler=(error, req, res, next)=>{
    const statusCode=error.statusCode ||500 ;
    const msg=error.message || "Unexpected Server Error";
    const stack=error.stack;
    res.status(statusCode).json({message:msg, reason:stack});
    
}

module.exports=serverErrorHandler