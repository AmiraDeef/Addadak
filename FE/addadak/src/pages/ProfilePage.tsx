import axios from "axios";
import { useEffect, useState } from "react";
import profile from "../assets/Profile.gif";
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
    
   


    const getUserInfo=async(token:any,id:any)=>{
        try{
            const {register, handleSubmit, formState:{errors,isValid,isSubmitting}}=useForm({mode:"onChange",defaultValues:{}});
            const userData=await axios.get(`http://localhost:3000/user/${id}`,{
                "headers":{"authorization":`Bearer ${token}`}
            });
            setFname(userData.data.User.firstName);
            setLname(userData.data.User.lastName);
            setAage(userData.data.User.age);
            setEmail(userData.data.User.email);
            setNumber(userData.data.User.phone);
            setNid(userData.data.User.nationalID); 
            
            
            

        }catch(error:any){
            const problem=error.response.data.message ||error.response.data.msg;
            alert(problem);
        }
    }

    useEffect(()=>{
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
                         className=" border w-40 bg-my-white py-1 ps-1 border border-secondary-purple"
                         disabled={edit}
                         placeholder= {fname}

                        >
                           
                        </input>
                    </div>
                    <div className="lastName flex flex-col gap-1">
                        <label htmlFor="lname"className="text-secondary-purple font-bold text-xl" >Last Name</label>
                        <input 
                        id="lname" 
                        className=" border w-40 bg-my-white py-1 ps-1 border border-secondary-purple"
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
                        className=" border w-40 bg-my-white py-1 ps-1 border border-secondary-purple"
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