const express=require ("express");
const mongoose=require("mongoose");
const cors=require("cors");
const morgan = require("morgan");


const errorHandler=require("./middlewares/errorHandler")


require("dotenv").config();
const app=express();
const walletRoutes=require("./routes/wallet.routes")
const webhookRoutes=require("./routes/webhook.routes")
const cookies=require("cookie-parser");

app.use("/webhook",webhookRoutes) //express.raw NOT json 

app.use(express.json());
app.use(cookies())
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan(process.env.ENV));
app.use("/logged/user/wallet",walletRoutes)


const DB_connection=async()=>{
    await mongoose.connect(process.env.DB_URL);
    console.log("wallet DB connected");
}

DB_connection();




app.use(errorHandler);
app.listen(process.env.PORT||3003,()=>{
    console.log(`wallet Server is listening to port: ${process.env.PORT}`)
})