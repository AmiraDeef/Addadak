//server
const express=require("express");
const app=express();

//dotenv activation
require("dotenv").config();

//dependencies
const mongoose=require("mongoose");
const morgan=require("morgan");
const cors=require("cors");
const globalErrorHnadler=require("./middlewares/globalErrorHandler.js");
const cookies=require("cookie-parser")


app.use(express.json());
app.use(cookies());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan(process.env.ENV))



//db connection
dataBaseConnection=async()=>{
    await mongoose.connect(process.env.DB_URL);
    console.log("Data base is connected for AI (o_o) ");
};
dataBaseConnection();

//global error hander
app.use(globalErrorHnadler);

//server connection
app.listen(process.env.PORT||3002,()=>{
    console.log(`Server is listening to port ${process.env.PORT}`);
});