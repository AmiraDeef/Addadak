
import {useForm,} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/authSlice';
import type { AppDispatch } from '../../../store/store';

import Swal from 'sweetalert2';
import api from "../../../api/axios.tsx";


const Login=()=>{
    const {register, handleSubmit, formState:{errors,isValid,isSubmitting}, reset}=useForm({mode:"onChange"});
    const navigate=useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    interface inputs{

        class:string,
        for:string,
        label:string,
        type:string,
        id:string,
        obj:any
    }

    const fields:Array<inputs>=[ 
        {class:"email",for:"email",label:"Email",type:"email" ,id:"email",obj:{required:"Email is required", pattern:{value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,message:"Please enter a valid email format"}}},
        {class:"password" , for :"password", type:"password",label:"Password" , id:"password", obj:{required:"Password is required", pattern:{value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&'%])[A-Za-z\d@$!%*?&'%]{8,}$/ ,message:"password should have at least one capital letter, a small letter, a digit and a symbol"},minLength:{value:8,message:"min lenght of password should be 8 characters"}}}
    ];

    const gotoProfile=async(data:any)=>{
        try{
            const res=await api.authApi.post("user/login",data,{withCredentials:true});
            console.log(res);
            if(res.status==200){
               
                dispatch(login({ nid: res.data.User.nationalID, id: res.data.User._id,firstName:res.data.User.firstName }));
                navigate("/logged/user/dashboard/electricity");
                reset();
            }
        }catch(error:any){
            const msg=error.response.data.message||error.response.data.msg
            const status=error.response.status
            if (msg ==="jwt expired"){
                Swal.fire({
                    title: 'Session Expired!',
                    text: 'Please login again.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                    }); 
                navigate("/user/login");

            }

            if (status ===404){
                Swal.fire({
                    title: 'Login Failed!',
                    text: 'wrong email or password please try again.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                    }); 
                navigate("/user/login");

            }
        }
    }
    
    return (
        
        
        <section className='  items-center justify-center bg-black/10 px-4 flex flex-col min-h-[calc(100vh-106px)] pb-14 py-6 gap-8  md:gap-12 '>
            <div className="texts texts w-full max-w-md">
                <h2 className='text-center font-bold text-5xl'>Login to your account</h2>   
            </div>
        
            
            <form method="post " 
             className="flex w-full max-w-md flex-col gap-8 bg-secondary-purple rounded-2xl  px-6 py-8 shadow-lg mx-auto md:px-10 md:py-12"
             onSubmit={handleSubmit(gotoProfile)}>
                <div className="rows flex flex-col justify-around gap-5 ">
                    {
                        fields.map
                        (
                            (ele:any,index:number)=>{ 
                                return(
                                        <div key={index} className={`${ele.class} flex flex-col gap-2`}>
                                        
                                            <label htmlFor={ele.for} className='text-my-white font-bold text-xl'>{ele.label}</label>
                                            <input className='border bg-my-white ps-5 py-1 rounded-lg' type={ele.type} id={ele.id} {...register(ele.id,ele.obj)}/>
                                            {
                                                errors[ele.id]&&(
                                                    <span className='text-gas-yellow text-sm'>{`${errors[ele.id]?.message}`}</span>
                                                )
                                            }

                                        </div>
                                );
                            }
                        )

                    }

                </div>
                <div className="buttons flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full ">

                    <button type='submit'   className={!isValid||isSubmitting?`bg-my-white  w-full text-sm md:text-base py-2.5 font-bold text-blue rounded-lg`:` bg-blue w-full text-sm md:text-base py-2.5 font-bold text-my-white hover:text-blue hover:bg-my-white rounded-lg`} disabled={!isValid||isSubmitting}>
                        {isSubmitting||!isValid?"Loading....":"Login"}
                    </button>

                    <button onClick={()=>reset()} className='bg-gas-yellow w-full text-sm md:text-base py-2.5 font-bold text-black hover:text-gas-yellow hover:bg-black duration-300 rounded-lg'>Clear</button>

                </div>  
            </form>  
        </section>
        
    );
}

export default Login;