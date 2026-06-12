
import {useForm,} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login=()=>{
    const {register, handleSubmit, formState:{errors,isValid,isSubmitting}, reset}=useForm({mode:"onChange"});
    const navigate=useNavigate();

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
            const res=await axios.post("http://localhost:3000/user/login",data);
            localStorage.setItem('token',res.data.Token);
            localStorage.setItem("UserId",res.data.User._id);
            navigate("/logged/user/profile");
            reset();
        }catch(error:any){
            const msg=error.response.data.message||error.response.data.msg
            alert(msg);
        }
    }
    
    return (
        
        
        <section className='  items-center justify-center bg-black/10 px-5 flex flex-col h-208 gap-20 '>
            <div className="texts w-200">
                <h2 className='text-center font-bold text-5xl'>Login to your account,</h2>   
            </div>
        
            
            <form method="post " 
             className="flex w-150 flex-col gap-15 bg-secondary-purple rounded  px-10 py-12 shadow-lg"
             onSubmit={handleSubmit(gotoProfile)}>
                <div className="rows flex flex-col justify-around gap-5 ">
                    {
                        fields.map
                        (
                            (ele:any,index:number)=>{ 
                                return(
                                        <div key={index} className={`${ele.class} flex flex-col gap-2`}>
                                        
                                            <label htmlFor={ele.for} className='text-my-white font-bold text-xl'>{ele.label}</label>
                                            <input className='border bg-my-white ps-5 py-1' type={ele.type} id={ele.id} {...register(ele.id,ele.obj)}/>
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
                <div className="buttons flex flex-row justify-around">

                    <button type='submit'   className={!isValid||isSubmitting?`bg-my-white px-10 w-40  py-2 font-bold text-blue`:` w-40 bg-blue  px-10 py-2 font-bold text-my-white hover:text-blue hover:bg-my-white`} disabled={!isValid||isSubmitting}>
                        {isSubmitting||!isValid?"Loading....":"Login"}
                    </button>

                    <button onClick={()=>reset()} className='bg-gas-yellow px-10 py-2 w-40 font-bold text-black hover:text-gas-yellow hover:bg-black duration-300'>Clear</button>

                </div>  
            </form>  
        </section>
        
    );
}

export default Login;