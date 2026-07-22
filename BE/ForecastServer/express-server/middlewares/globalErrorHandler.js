const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.isAxiosError && err.response) {
        statusCode = err.response.status; 
        
      
        if (err.response.data && err.response.data.detail) {
            message = err.response.data.detail;
        } else {
            message = err.response.data;
        }
    }


    res.status(statusCode).json({
        success: false,
        status: statusCode,
        errorSource: err.isAxiosError ? "Python Microservice" : "Express Server",
        message: message,
     
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = globalErrorHandler;