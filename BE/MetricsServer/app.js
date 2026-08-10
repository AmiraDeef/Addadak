const express=require ("express");
const mongoose=require("mongoose");
const cors=require("cors");
const morgan = require("morgan");
const serverErrorHandler=require("./globalErrorHandler");
require("dotenv").config();
const app=express();
const metricsRouters=require("./metricsRoutes/metricsRoutes")
const cookies=require("cookie-parser");

app.use(express.json());
app.use(cookies())
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan(process.env.ENV));
app.use("/logged/user",metricsRouters);

const DB_connection=async()=>{
    await mongoose.connect(process.env.DB_URL);
    console.log("Metrics DB connected");
}

DB_connection();




app.use(serverErrorHandler);
app.listen(process.env.PORT||3002,()=>{
    console.log(`Metrics Server ia listening to port: ${process.env.PORT}`)
})