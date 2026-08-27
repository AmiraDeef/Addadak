const express=require ("express");
const mongoose=require("mongoose");
const cors=require("cors");
const morgan = require("morgan");
const serverErrorHandler=require("./globalErrorHandler");
require("dotenv").config();
const app=express();

const cookies=require("cookie-parser");

const electricMetricsRouter = require("./metricsRoutes/electicityRoutes") //for testing
const gasMetricsRouter = require('./metricsRoutes/gasRoutes');
const waterMetricsRouter = require('./metricsRoutes/waterRoutes');
app.use(express.json());
app.use(cookies())
app.use(cors({
    origin:"https://addadak.vercel.app",//http://localhost:5173
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan(process.env.ENV));


const DB_connection=async()=>{
    await mongoose.connect(process.env.DB_URL);
    console.log("Metrics DB connected");
}

DB_connection();


app.use("/logged/user/elec",electricMetricsRouter);
app.use("/logged/user/gas",gasMetricsRouter);
app.use("/logged/user/water",waterMetricsRouter);

app.use(serverErrorHandler);
app.listen(process.env.PORT||3002,()=>{
    console.log(`Metrics Server ia listening to port: ${process.env.PORT}`)
})