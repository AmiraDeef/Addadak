//server
const express=require("express");
const app=express();

//dotenv activation
require("dotenv").config();

//dependencies
const mongoose=require("mongoose");
const mongoSanitize=require("express-mongo-sanitize");
const xssClean=require("xss-clean");
const morgan=require("morgan");
const cors=require("cors");
const globalErrorHnadler=require("./middlewres/serverErrorHandler.js");
const userRouter=require("./routes/userRoute.js");
const cookies=require("cookie-parser")

//server activation
app.use(express.json());
app.use(cookies());
//app.use(mongoSanitize());
//app.use(xssClean());
app.use(cors({
    origin:"https://addadak.vercel.app",//http://localhost:5173
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan(process.env.ENV))
app.use("/",userRouter);


//db connection
dataBaseConnection=async()=>{
    await mongoose.connect(process.env.DB_URL);
    console.log("Data base is connected (o_o) ");
};
dataBaseConnection();

//global error hander
app.use(globalErrorHnadler);

//server connection
app.listen(process.env.PORT||3000,()=>{
    console.log(`Server is listening to port ${process.env.PORT}`);
});