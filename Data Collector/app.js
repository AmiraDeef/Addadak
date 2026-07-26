//dot env
require('dotenv').config();
const config  = require('./config/index');
//express
const express = require("express");
const app = express();
const port = process.env.PORT

const ElectricityScheduler = require('./scheduler/electricityScheduler')
//logger
const {logger} = require('./utils/logger')
//mongoose 
const DB_connection = require('./config/database');

//handel uncaught exceptions 
process.on('uncaughtException', (error) => {
  logger.error('CRITICAL: Uncaught Exception detected!', error);
});

// 2. Handling Unhandled Promise Rejections 
process.on('unhandledRejection', (reason, promise) => {
  logger.error('CRITICAL: Unhandled Promise Rejection at:', { promise, reason });
});

//handking DB connection errors 
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB Connection Error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection lost. Attempting to reconnect...');
});
async function start (){
    try{
        logger.info('Connecting to MongoDB...');
        DB_connection();

        ElectricityScheduler.start();
    }catch(error){
        logger.error('Fatal error during application startup:', error);
        process.exit(1);
    }
}

function handleShutdown(signal) {
  logger.info(`Received ${signal}. Shutting down Data Collector Service gracefully...`);
  
 
  ElectricityScheduler.stop();

  mongoose.connection.close(false, () => {
    logger.info('MongoDB connection closed. Process exiting.');
    process.exit(0);
  });
}


process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));


start();

app.listen(port,()=>{
    logger.info(`server is running on ${port}`)
})