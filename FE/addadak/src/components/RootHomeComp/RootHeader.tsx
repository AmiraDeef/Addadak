import Logo from "../Logo";
import { NavLink } from "react-router-dom";

const RootHeader=()=>{
    return(
        <header className="flex flex-row
         justify-between items-center
         border-b border-secondary-purple
         shadow-lg px-4 py-3 md:py-4
         sm:px-6 md:px-16 lg:px-24 
         sticky top-0 z-50 w-full
         backdrop-blur-sm 
         bg-secondary-purple/20">
            <Logo textcolor="purple" logowidth={65}></Logo>
            <div className="buttons flex flex-row gap-3 sm:gap-6 ">
                <button className="shadow-md
                 bg-my-white
                 border border-secondary-purple
                 w-20 h-10 m-auto 
                 rounded-lg 
                 text-secondary-purple font-bold
                 hover:bg-secondary-purple
                 hover:text-my-white
                 hover:cursor-pointer
                 duration-300">
                    <NavLink to="/user/login">Login</NavLink>
                </button>

                <button className="shadow-md
                 w-20 h-10
                 m-auto px-2 
                 bg-secondary-purple 
                 rounded-lg 
                 text-my-white font-bold
                 hover:bg-my-white
                 hover:border
                 hover:border-secondary-purple
                 hover:text-secondary-purple 
                 hover:cursor-pointer
                 duration-300">
                    <NavLink to="/user/register">Sign Up</NavLink>
                    
                </button>
            </div>


        </header>

    );
}
export default RootHeader;