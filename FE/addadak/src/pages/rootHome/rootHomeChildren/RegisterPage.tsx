import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Register=()=>{

    const {register, handleSubmit, formState:{errors,isValid,isSubmitting}, reset, watch}=useForm({mode:"onChange"});
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

        {class:"firstName",for:"firstName",label:"First Name",type:"text" ,id:"firstName",obj:{required:"First name is required", pattern:{value:/^[a-zA-Z]/,message:"First Name accepts letters only"} }},
        {class:"lastName",for:"lastName",label:"Last Name",type:"text" ,id:"lastName",obj:{required:"Last name is required", pattern:{value:/^[a-zA-Z]/,message:"Last Name accepts letters only"} }},
        {class:"age",for:"age",label:"Age",type:"number" ,id:"age",obj:{required:"Age is required", min:{value:21,message:"Minimum age is 21"}, max:{value:90, message:"Maximum age is 90"} }},
        {class:"email",for:"email",label:"Email",type:"email" ,id:"email",obj:{required:"Email is required", pattern:{value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,message:"Please enter a valid email format"}}},
        {class:"password" , for :"password", type:"password",label:"Password" , id:"password", obj:{required:"Password is required", pattern:{value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&'%])[A-Za-z\d@$!%*?&'%]{8,}$/ ,message:"password should have at least one capital letter, a small letter, a digit and a symbol"},minLength:{value:8,message:"min lenght of password should be 8 characters"}}},
        {class:"confirm" ,for:"confirm",type:"password" ,label:"Confirm Password" ,id:"confirm",obj:{required:"Please confirm your password",validate:(value:any)=>value===watch("password")||"passwords are not matching" }},
        {class:"phone" ,for:"phone",type:"text" ,label:"Phone Number" ,id:"phone",obj:{required:"Phone number is required",pattern:{value:/^(?:\+20|20)?0?1[0125]\d{8}$/, message:"only Egyptian numbers are allowed"},minLength:{value:11, message:"Phone number should be 11 digits"}}} ,
        {class:"nationalID" ,for:"nationalID", label:"National ID",type:"text" ,id:"nationalID",obj:{required:"National Id is required",pattern:{value:/^([23])(?:\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?:\d{7})$/, message:"Only Egytian national IDs are allowed"} }},

    ];

    const gotoProfile=async (data:any)=>{
        try
        {
            const res=await axios.post("http://localhost:3000/user/register",data);
            console.log(res)
            navigate("/logged/user/profile");
            reset();
        }catch(error:any){
            const msg=error.response.data.message||error.response.data.msg
            alert(msg);
            
        }
    }
    
    return (
        
        
        <section className=' justify-around items-center  bg-black/10 px-5 flex flex-row py-8.5 gap-1 '>
            <div className="texts w-200 flex flex-col gap-5   ">
                <h2 className='text-center font-bold text-5xl'>Create your own account,</h2>
                <h2 className='text-center font-bold text-5xl'>and track your</h2>
                <h2 className='text-center font-bold text-5xl'>home meters</h2>
            </div>
        
            
            <form method="post" 
             className="flex w-150 flex-col gap-5 bg-secondary-purple rounded  px-10 py-12 shadow-lg"
             onSubmit={handleSubmit(gotoProfile)}>
                <div className="rows flex flex-row gap-15 justify-between">
                    {

                        fields.map
                        (
                            (ele:any,index:number)=>{
                                
                                
                                return(
                                        index==0||index==1?
                                    
                                        <div key={index} className={`${ele.class} flex flex-col gap-2 `}>
                                        
                                            <label htmlFor={ele.for} className='text-my-white font-bold text-xl'>{ele.label}</label>
                                            <input className='border bg-my-white ps-5 py-1' type={ele.type} id={ele.id} {...register(ele.id,ele.obj)}/>
                                            {errors[ele.id]&&
                                                (
                                                <span className='text-gas-yellow text-sm'>{`${errors[ele.id]?.message}`}</span>
                                                )
                                            }

                                        </div>

                                        :<></>
                                    
                                );
                            }
                        )

                    }

                </div>
                <div className="rows flex flex-col justify-around gap-5 ">
                    {

                        fields.map
                        (
                            (ele:any,index:number)=>{
                                
                                
                                return(
                                        index>1?
                                    
                                        <div key={index} className={`${ele.class} flex flex-col gap-2`}>
                                        
                                            <label htmlFor={ele.for} className='text-my-white font-bold text-xl'>{ele.label}</label>
                                            <input className='border bg-my-white ps-5 py-1' type={ele.type} id={ele.id} {...register(ele.id,ele.obj)}/>
                                            {
                                                errors[ele.id]&&
                                                (
                                                    <span className='text-gas-yellow text-sm'>{`${errors[ele.id]?.message}`}</span>
                                                )
                                            }
                                        </div>

                                        :<></>
                                    
                                );
                            }
                        )

                    }

                </div>

                <div className="buttons flex flex-row justify-around">

                    <button type='submit'   className={!isValid||isSubmitting?`bg-my-white px-10 w-40  py-2 font-bold text-blue`:` w-40 bg-blue px-10 py-2 font-bold text-my-white hover:text-blue hover:bg-my-white`} disabled={!isValid||isSubmitting}>
                        {isSubmitting || !isValid? "Loading...." : "Submit" }
                    </button>

                    <button type='button' onClick={()=>reset()} className='bg-gas-yellow px-10 py-2 w-40 font-bold text-black hover:text-gas-yellow hover:bg-black duration-300'>Clear</button>

                </div>
            </form>

            
            
        </section>
        
    );
}

export default Register;