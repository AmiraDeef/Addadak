import { NavLink } from "react-router-dom";
import gas from "../../assets/Gas.png"
import spark from "../../assets/spark.png"

interface props{
    title:string
}

const LoggedHeader=({title}:props)=>{
    return(
        <header className="flex flex-row  px-10 py-8 content-around justify-around bg-secondary-purple/20 border-b border-b-secondary-purple shadow-lg items-center">
            <div className="title text-4xl font-bold">
                {title}
            </div>

            <div className="buttons gap-5 flex flex-row border rounded-xl p-1 border-secondary-purple shadow-md shadow-secondary-purple/40 ">
                 <NavLink to="/logged/user/dashboard/electricity" 
                    className={({ isActive }: { isActive: boolean }): string => 
                        `rounded-xl flex flex-row items-center gap-3  w-40 justify-center  duration-300
                        ${isActive ? 'bg-secondary-purple text-my-white hover:text-electric-cyan' : 'text-black/40  hover:text-black'}`
                    }
                    >
                    <img src={spark} alt="sparkIcon"    width={55}  />
                    <span className="font-bold">Electricity</span>


                </NavLink>
                

                <NavLink to="/logged/user/dashboard/gas" 
                    className={({isActive}:{isActive:boolean}):string=>` duration-300 duraion rounded-xl flex flex-row items-center gap-3  w-40 justify-center
                    ${isActive?'bg-secondary-purple text-my-white hover:text-gas-yellow' : 'text-black/40  hover:text-black '}` }>
                    <img src={gas} alt="fireIcon"   width={45}  />
                    <span className="font-bold">Gas</span>
                </NavLink>

            </div>
           


        </header>
    )
}

export default LoggedHeader;