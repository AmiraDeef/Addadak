const mongoose = require("mongoose");
const {logger} = require('../config/logger');
const DB_connection = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL,{dbName:""})
        logger.info("Data base is connnected successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = DB_connection;