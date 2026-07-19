//dot env
require('dotenv').config();
//express
const express = require("express");
const app = express();
const port = process.env.PORT

//logger
const {logger} = require('./config/logger')
//mongoose 
const DB_connection = require('./config/database');
DB_connection();

//Testing the Electricity Provider by using fake api:
const ELectricityProvider = require('./providers/electricityProvider');

async function testCollector(){
    const data = await ELectricityProvider.getLatestReadings();

   
}



testCollector();






app.listen(port,()=>{
    logger.info(`server is running on ${port}`)
})