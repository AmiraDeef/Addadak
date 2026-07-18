const mongoose = require("mongoose");

const DB_connection = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL,{dbName:""})
        console.log("Data base is connnected successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = DB_connection;