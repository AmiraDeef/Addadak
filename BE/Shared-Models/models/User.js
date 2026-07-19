const mongoose=require("mongoose");
const bcrypt = require("bcrypt");
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        match:[/^[a-zA-Z]/,"First name should have alphabetical characters only" ],
    },

    lastName:{
        type:String, 
        match:[/^[a-zA-Z]/,"Last name should have alphabetical characters only" ],
    },

    age:{
        type:Number,
        
        min:[21,"minimum age is 21"],
        max:[90,"maximum age is 90"],
       

    },

    email:{
        type:String,
        required:[true,"Email is required."],
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Please enter a valid email address."], 
        unique:[true, "This email already exists."],
        trim:true
    },

    password:{
        type:String,
        required:[true,"Password is required."],
        match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&'%])[A-Za-z\d@$!%*?&'%]{8,}$/,"Please enter a valid password where it should have at least one capital letter, one small letter, one number, one symbol and no spaces."], 
        trim:true,
        select:false
    },

    


    phone:{
        type:String,
        match:[/^(?:\+20|20)?0?1[0125]\d{8}$/,"Please enter a valid egyptian phone number."],
        unique:[true,"this phone number already exists"],
        minLength:[11,"only 11 digits allowed for agyptian phone numbers."],
        trim:true
    },

    nationalID:{
        type:String,
        match:[/^([23])(?:\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?:\d{7})$/,"Please enter a valid Egyptian National ID."],
        unique:[true,"This National ID already exists."],
        trim:true,
        required:true
    },


},{timestamps:true});

userSchema.pre("save",async function(){
    if(!this.isModified("password"))return 
     this.password=await bcrypt.hash(this.password,11);
     
});

userSchema.methods.checkPassword=async function (pass){
    let check=await bcrypt.compare(pass,this.password);
    return check;
}

module.exports=userSchema;