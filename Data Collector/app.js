//dot env
require('dotenv').config();
//express
const express = require("express");
const app = express();
const port = process.env.PORT

//mongoose 
const DB_connection = require('./config/database');
DB_connection();









app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})