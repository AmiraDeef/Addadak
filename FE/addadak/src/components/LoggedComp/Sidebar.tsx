import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import Logo from "../Badges/Logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";



const Sidebar=()=>{

    const navigate=useNavigate();
    const{Logout}=useAuth()!

    const logout=()=>{
        Logout();

    navigate('/user/login');
} 
    interface tabstemp{
        icon:ReactElement,
        title:string,
        link:string
    }
    const tabs:Array<tabstemp>=[
        {icon:<i className="fa-regular fa-circle-user"></i>, title:"Profile", link:"/logged/user/profile"},
        {icon:<i className="fa-solid fa-chart-line"></i> ,title:"Dashboard", link:"/logged/user/dashboard/electricity"},
        {icon:<i className="fa-solid fa-eye"></i>,title:"Forecast", link:"/logged/user/forecast"},
        {icon:<i className="fa-regular fa-credit-card"></i>,title:"My wallet", link:"/logged/user/credit"}

    ]
    return(
        <aside className="  bg-secondary-purple hidden md:flex flex-col text-my-white px-6 py-1.5 w-[340px] lg:w-[250px] h-full  top-0 left-0 z-50 transition-all duration-300">
            <div className="title border-b-1  ">
                <Logo textcolor="white" logowidth={55}></Logo>
            </div>

            <div className="tabs flex flex-col gap-10 pt-10 text-2xl  ">
                {
                    tabs.map((ele,index)=>{
                        return(
                            <div key={index} className={`${ele.title} `}>
                                <Link to={ele.link} className="flex flex-row gap-5 hover:text-electric-cyan">
                                    <div>{ele.icon}</div>
                                    <div>{ele.title}</div>
                                </Link>
                            </div>

                        );
                    })
                }

            </div>

            <div className="logout text-xl border-t border-white/20 mt-auto pb-4">
                <button type="button" className="flex flex-row items-center  gap-5 pt-5 hover:text-electric-cyan" onClick={logout}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <div>Logout </div>
                </button>

            </div>

        </aside>
    );
}
export default Sidebar;