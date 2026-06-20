const express=require ("express");
const mongoose=require("mongoose");
const cors=require("cors");
const morgan = require("morgan");
const serverErrorHandler=require("./globalErrorHandler");
require("dotenv").config();


const app=express();
app.use(express.json());
app.use(cors());
app.use(morgan(process.env.ENV));

const DB_connection=async()=>{
    await mongoose.connect(process.env.DB_URL);
    console.log("Metrics DB connected");
}

DB_connection();


app.use(serverErrorHandler);
app.listen(process.env.PORT,()=>{
    console.log(`Metrics Server ia listening to port: ${process.env.PORT}`)
})