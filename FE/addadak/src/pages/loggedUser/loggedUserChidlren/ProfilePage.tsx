import axios from "axios";
import { useEffect, useState } from "react";
import profile from "../../../assets/Profile.gif";
import {useForm,} from 'react-hook-form'

const UserProfile=()=>{

    const [fname, setFname]=useState("");
    const [lname, setLname]=useState("");
    const [age, setAage]=useState("");
    const [email, setEmail]=useState("");
    const [number, setNumber]=useState("");
    const [nid, setNid]=useState("");
    const [edit, setEdit]=useState(true);
    const token=localStorage.getItem("token");
    const id=localStorage.getItem("UserId");
    const {register, handleSubmit, reset,formState:{errors,isValid,isSubmitting}}=useForm({mode:"onChange"});

    interface inputs{

        class:string,
        for:string,
        label:string,
        type:string,
        id:string,
        obj:any
    }

    const fields:Array<inputs>=[

        {class:"firstName",for:"firstName",label:"First Name",type:"text" ,id:"firstName",obj:{required:"First name is required", pattern:{value:/^[a-zA-Z]/,message:"First Name accepts letters only"} }},
        {class:"lastName",for:"lastName",label:"Last Name",type:"text" ,id:"lastName",obj:{required:"Last name is required", pattern:{value:/^[a-zA-Z]/,message:"Last Name accepts letters only"} }},
        {class:"age",for:"age",label:"Age",type:"number" ,id:"age",obj:{required:"Age is required", min:{value:21,message:"Minimum age is 21"}, max:{value:90, message:"Maximum age is 90"} }},
        {class:"email",for:"email",label:"Email",type:"email" ,id:"email",obj:{required:"Email is required", pattern:{value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,message:"Please enter a valid email format"}}},
        {class:"password" , for :"password", type:"password",label:"Password" , id:"password", obj:{required:"Password is required", pattern:{value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&'%])[A-Za-z\d@$!%*?&'%]{8,}$/ ,message:"password should have at least one capital letter, a small letter, a digit and a symbol"},minLength:{value:8,message:"min lenght of password should be 8 characters"}}},
        {class:"confirm" ,for:"confirm",type:"password" ,label:"Confirm Password" ,id:"confirm",obj:{required:"Please confirm your password",validate:(value:any)=>value===watch("password")||"passwords are not matching" }},
        {class:"phone" ,for:"phone",type:"text" ,label:"Phone Number" ,id:"phone",obj:{required:"Phone number is required",pattern:{value:/^(?:\+20|20)?0?1[0125]\d{8}$/, message:"only Egyptian numbers are allowed"},minLength:{value:11, message:"Phone number should be 11 digits"}}} ,
        {class:"nationalID" ,for:"nationalID", label:"National ID",type:"text" ,id:"nationalID",obj:{required:"National Id is required",pattern:{value:/^([23])(?:\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?:\d{7})$/, message:"Only Egytian national IDs are allowed"} }},

    ];


    useEffect(()=>{
            const getUserInfo=async(token:any,id:any)=>{
        try{
            
            const userData=await axios.get(`http://localhost:3000/user/${id}`,{
                "headers":{"authorization":`Bearer ${token}`}
            });
            setFname(userData.data.User.firstName);
            setLname(userData.data.User.lastName);
            setAage(userData.data.User.age);
            setEmail(userData.data.User.email);
            setNumber(userData.data.User.phone);
            setNid(userData.data.User.nationalID); 
            interface comingData{fName:string,lName:string,age:string,email:string,number:string, nId:string}
            const dbData:comingData={fName:fname, lName:lname,age:age, email:email, number:number, nId:nid}
            reset(dbData);
            

        }catch(error:any){
            const problem=error.response.data.message ||error.response.data.msg;
            alert(problem);
        }
    }
        getUserInfo(token,id);
       
    },[]);

    const editUserInfo=async()=>{

    }
   
    return(
    <section className="flex justify-center">
        <form 
         method="post"
         onSubmit={editUserInfo}
         className="card flex flex-col mt-40 border border-secondary-purple p-10 gap-10 bg-secondary-purple/20 rounded w-200 items-center">
            <div className="userIcon">
                <img src={profile} width={150} />
            </div>

            <div className="info w-150">
                <div className="fullName flex flex-row justify-around">
                    <div className="firstName flex flex-col gap-1">
                        <label htmlFor="fname"className="text-secondary-purple font-bold text-xl">First Name</label>
                        <input 
                         id="fname"
                         className=" border w-40 bg-transparent py-1 ps-1 border border-secondary-purple"
                         disabled={edit}
                        
                         

                        >
                           
                        </input>
                    </div>
                    <div className="lastName flex flex-col gap-1">
                        <label htmlFor="lname"className="text-secondary-purple font-bold text-xl" >Last Name</label>
                        <input 
                        id="lname" 
                        className=" border w-40 bg-transparent py-1 ps-1  border border-secondary-purple"
                        disabled={edit}
                        placeholder={lname}
                        >
                        </input>
                    </div>
                    <div className="age flex flex-col gap-1">
                        <label htmlFor="age" 
                         className="text-secondary-purple font-bold text-xl">Age</label>
                        <input 
                        id="age" 
                        className=" border w-40 bg-transparent py-1 ps-1 border border-secondary-purple"
                        disabled={edit}
                        placeholder={age}
                        ></input>
                    </div>
                </div>

                <div className="Email">
                    <div className="email">
                        {email}
                    </div>
                </div>
                <div className="numberAndID">
                    <div className="number">
                        {number}
                    </div>
                    <div className="id">
                        {nid}
                    </div>
                </div>
            </div>

        </form>

    </section>
        
    );
}

export default UserProfile;