import { NavLink } from "react-router-dom";
import gas from "../../assets/Gas.png"
import spark from "../../assets/spark.png"
import water from "../../assets/WaterDrop.png"

interface props{
    title:string
}

const LoggedHeader=({title}:props)=>{
    return(
        <header className="flex  flex-row justify-between items-center px-4 md:px-10 h-20 bg-secondary-purple/20 border-b border-b-secondary-purple shadow-lg w-full py-3">
            <div className="title text-xl sm:text-2xl md:text-4xl font-bold transition-all">
                {title}
            </div>

            <div className="buttons gap-5 flex flex-row border rounded-xl p-1 border-secondary-purple shadow-md shadow-secondary-purple/40 ">
                 <NavLink to="/logged/user/dashboard" 
                    className={({ isActive }: { isActive: boolean }): string => 
                        `rounded-xl flex flex-row items-center gap-3   w-40 justify-center w-auto md:w-40   p-2 sm:p-0 duration-300
                        ${isActive ? 'bg-secondary-purple text-my-white hover:text-electric-cyan' : 'text-black/40  hover:text-black'}`
                    }
                    >
                    <img src={spark} alt="sparkIcon"   className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain" />
                    <span className="font-bold hidden md:inline">Electricity</span>


                </NavLink>
                

                <NavLink to="/logged/user/dashboard/gas" 
                    className={({isActive}:{isActive:boolean}):string=>` duration-300 duraion rounded-xl flex flex-row items-center gap-3 w-auto md:w-40 p-2 sm:p-0 w-40 justify-center
                    ${isActive?'bg-secondary-purple text-my-white hover:text-gas-yellow' : 'text-black/40  hover:text-black '}` }>
                    <img src={gas} alt="fireIcon"   className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"  />
                    <span className="font-bold hidden md:inline">Gas</span>
                </NavLink>


                <NavLink to="/logged/user/dashboard/water" 
                    className={({isActive}:{isActive:boolean}):string=>` duration-300 duraion rounded-xl flex flex-row items-center gap-3 w-auto md:w-40 p-2 sm:p-0 w-40 justify-center
                    ${isActive?'bg-secondary-purple text-my-white hover:text-blue' : 'text-black/40  hover:text-black '}` }>
                    <img src={water} alt="fireIcon"   className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"  />
                    <span className="font-bold hidden md:inline">Water</span>
                </NavLink>

            </div>
           


        </header>
    )
}

export default LoggedHeader;