const mongoose = require("mongoose");
const config  = require('../config/index')
const {logger} = require('../utils/logger');
const DB_connection = async()=>{
    try {
        await mongoose.connect(config.mongo.uri,{dbName:""})
        logger.info("Data base is connnected successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = DB_connection;