import { NavLink } from "react-router-dom";
import gas from "../../assets/Gas.png"
import spark from "../../assets/spark.png"

interface props{
    title:string
}

const LoggedHeader=({title}:props)=>{
    return(
        <header className="flex flex-row justify-between items-center px-10 pt-8 ">
            <div className="title text-4xl font-bold">
                {title}
            </div>

            <div className="buttons gap-5 flex flex-row border rounded-xl p-1 border-secondary-purple shadow-md shadow-secondary-purple/40 ">
                 <NavLink to="/logged/user/dashboard/electric" className=" electric  rounded-xl flex flex-row items-center gap w-40 justify-center bg-my-white text-black/40 hover:text-black">
                    <img src={spark} alt="sparkIcon"    width={55}  />
                    <span>Electricity</span>


                </NavLink>

                <NavLink to="/logged/user/dashboard/gas" className={`gas  rounded-xl flex flex-row items-center gap-3  w-40 justify-center  text-black/40 hover:text-black` }>
                    <img src={gas} alt="fireIcon"   width={45}  />
                    <span>gas</span>
                </NavLink>

            </div>
           


        </header>
    )
}

export default LoggedHeader;