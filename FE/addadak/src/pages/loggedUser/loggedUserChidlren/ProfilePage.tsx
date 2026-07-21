
import { useEffect, useState } from "react";
import profile from "../../../assets/Profile.gif";
import {useForm,} from 'react-hook-form'
import { useAuth } from "../../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import api from "../../../api/axios.tsx";


const UserProfile=()=>{

   
    const [edit, setEdit]=useState(true);
    const {register, handleSubmit, reset ,formState:{errors, isValid}}=useForm({mode:"onChange"});
    const navigate=useNavigate();

    //const Token=localStorage.getItem("token");
    //const ID=localStorage.getItem("UserId");
    const{nid,id}=useAuth()!;


    let fname:string;
    let lname :string;
    let age:string;
    let email:string;
    let phone:string;
    let nID:string;

    interface inputs{

        class:string,
        for:string,
        label:string,
        type:string,
        id:string,
        obj:any
    }

    interface resetData{

        firstName:string,
        lastName:string,
        age:string,
        email:string,
        phone:string,
        nationalID:string
    }

    const fields:Array<inputs>=[

        {class:"firstName",for:"firstName",label:"First Name",type:"text" ,id:"firstName",obj:{required:"First name is required", pattern:{value:/^[a-zA-Z]/,message:"First Name accepts letters only"} }},
        {class:"lastName",for:"lastName",label:"Last Name",type:"text" ,id:"lastName",obj:{required:"Last name is required", pattern:{value:/^[a-zA-Z]/,message:"Last Name accepts letters only"} }},
        {class:"age",for:"age",label:"Age",type:"number" ,id:"age",obj:{required:"Age is required", min:{value:21,message:"Minimum age is 21"}, max:{value:90, message:"Maximum age is 90"} }},
        {class:"email",for:"email",label:"Email",type:"email" ,id:"email",obj:{required:"Email is required", pattern:{value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,message:"Please enter a valid email format"}}},
        {class:"phone" ,for:"phone",type:"text" ,label:"Phone Number" ,id:"phone",obj:{required:"Phone number is required",pattern:{value:/^(?:\+20|20)?0?1[0125]\d{8}$/, message:"only Egyptian numbers are allowed"},minLength:{value:11, message:"Phone number should be 11 digits"}}} ,
        {class:"nationalID" ,for:"nationalID", label:"National ID",type:"text" ,id:"nationalID",obj:{required:"National Id is required",pattern:{value:/^([23])(?:\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?:\d{7})$/, message:"Only Egytian national IDs are allowed"} }},

    ];



    useEffect(()=>{
            
            if (id === undefined || id === null || id === "") {
                return; 
                }
            if(!id){
                navigate('/user/notfound')
            }
            const getUserInfo=async(id:any)=>{

                try{
                    
                    const userData=await api.authApi.get(`logged/user/${id}`,{withCredentials: true });
                    console.log(userData)
                    fname=userData.data.User.firstName;
                    lname=userData.data.User.lastName;
                    age=userData.data.User.age;
                    email=userData.data.User.email;
                    phone=userData.data.User.phone;
                    nID=userData.data.User.nationalID;
                    

                    reset({
                        firstName:fname,
                        lastName:lname,
                        age:age,
                        email:email,
                        phone:phone,
                        nationalID:nID

                    });
                    

                }catch(error:any){
                    const problem=error.response.data.message ||error.response.data.msg;
                    if (problem ==="jwt expired"){
                        Swal.fire({
                            title: 'Session Expired!',
                            text: 'Please login again.',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                            }); 
                        navigate("/user/login");

                    }
                    console.log(problem);
                }
    }
        
        getUserInfo(id);

        
        
       
    },[id]);

    const editUserInfo=async (data:any)=>{
        try {
            const updatedData= await api.authApi.put(`/logged/user/update/${id}`, data, {withCredentials: true });
{console.log(updatedData)}
            fname=updatedData.data.updatedUser.firstName;
            lname=updatedData.data.updatedUser.lastName;
            age=updatedData.data.updatedUser.age;
            email=updatedData.data.updatedUser.email;
            phone=updatedData.data.updatedUser.phone;
            nID=updatedData.data.updatedUser.nationalID;

           setEdit(true);
            

           
                    

            reset({
                firstName:fname,
                lastName:lname,
                age:age,
                email:email,
                phone:phone,
                nationalID:nID
            });
        }
        catch(error:any){
            const problem=error.response?.data?.message ||error.response?.data?.msg;
            alert(problem);
        }

    }

    const DeleteUser=async()=>{
   
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this account deletion!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',         
        cancelButtonColor: '#6B46C1',      
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then(async (result) => {
        
        if (result.isConfirmed) {
            try {
                const deletMetrics=await api.elecApi.delete(`/deleteAllMeters/${nid}`,{ withCredentials: true })
                const deletedUser = await api.authApi.delete(`/logged/user/delete/${id}`, { withCredentials: true });
                
                
                
               if(deletedUser.status===200 && deletMetrics.status===200)
                await Swal.fire({
                    title: 'Deleted!',
                    text: deletedUser.data.message || 'Your account has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#6B46C1'
                });

                
                navigate("/");

            } catch (error: any) {
                const problem = error.response?.data?.message || error.response?.data?.msg || "Something went wrong";
                console.log(problem);
                
                
                Swal.fire({
                    title: 'Error!',
                    text: problem,
                    icon: 'error',
                    confirmButtonColor: '#6B46C1'
                });
            }
        }
    });
};

    
   
    return(
    <section className="flex flex-col md:flex-row p-4 sm:p-10 gap-6 md:gap-20 items-center md:items-start w-fill min-w-0 h-fill ">
        <div className="userIcon w-50 flex justify-center">
                <img src={profile} width={155} />
        </div>
        <form 
         
         onSubmit={handleSubmit(editUserInfo)}
         className="card flex flex-col w-full max-w-4xl gap-8 md:gap-15 rounded items-center sm:items-end flex-1 min-w-0">
            
            <div className="data grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full ">
                {
                    fields.map((ele:any,index:number)=>{
                        return(
                            <div key={index} className={`singleData flex flex-col gap-2 w-full min-w-0`}>
                                <label  htmlFor={ele.for} className=" text-secondary-purple font-bold text-xl">{ele.label}</label>
                                <input 
                                id={ele.id}
                                className=" rounded-lg border bg-transparent px-4 py-2.5 border-secondary-purple w-full"
                                disabled={edit}
                                {...register(ele.id,ele.obj)}
                                > 
                                </input>
                                {
                                    errors[ele.id]&&
                                    (
                                       <span className='text-gas-yellow text-sm'>{`${errors[ele.id]?.message}`}</span>
                                    )
                                }


                            </div>
                        )
                    })

                }
            </div>
             <div className="buttons flex  w-120 items-center justify-center ">
                {
                    (edit)?
                    (
                        
                        <button type="button" className="rounded-lg border duration-300 transition-all font-bold px-10 py-2 bg-secondary-purple text-my-white hover:bg-my-white hover:text-secondary-purple hover:cursor-pointer"
                            onClick={()=>setEdit(false)}>
                            Edit
                        </button>

                        
                       

                    ):
                    (
                        <div className="flex flex-col gap-3 sm:flex-row items-center md:items-end w-full justify-center md:justify-end">
                            <button 
                            type="submit" 
                            className="rounded-lg border duration-300 transition-all w-36 font-bold px-10 py-2 bg-secondary-purple text-my-white hover:bg-my-white hover:text-secondary-purple hover:cursor-pointer" 
                            disabled={!isValid}
                            >
                                {isValid? `Save`:`Edit`}
                            </button>

                            <button 
                            type="button" 
                            className="rounded-lg border duration-300 transition-all w-36 font-bold px-10 py-2 bg-gas-yellow hover:bg-my-white  hover:cursor-pointer" 
                            onClick={()=>{
                                setEdit(true);
                                reset();
                                }}>
                                Cancel
                            </button>
                            <button type="button"
                            className="rounded-lg border duration-300 transition-all font-bold  w-36   py-2 bg-warning hover:bg-my-white  hover:cursor-pointer"
                            onClick={DeleteUser}> 
                                Delete Account
                            </button>

                        </div>
                        

                    )

                }
                

                
                
            </div>

            

        </form>
       

    </section>
        
    );
}

export default UserProfile;