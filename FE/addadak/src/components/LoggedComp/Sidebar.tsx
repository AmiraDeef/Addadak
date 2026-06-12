import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

const Sidebar=()=>{

   
    interface tabstemp{
        icon:ReactElement,
        title:string,
        link:string
    }
    const tabs:Array<tabstemp>=[
        {icon:<i className="fa-regular fa-circle-user"></i>, title:"Profile", link:"/logged/user/profile"},
        {icon:<i className="fa-solid fa-chart-line"></i> ,title:"Dashboard", link:"/logged/user/dashboard"},
        {icon:<i className="fa-solid fa-eye"></i>,title:"Forecast", link:"/logged/user/forecast"},
        {icon:<i className="fa-regular fa-credit-card"></i>,title:"My credit", link:"/logged/user/credit"}

    ]
    return(
        <aside className="  bg-secondary-purple flex flex-col text-my-white p-5 w-75 h-svh">
            <div className="title border-b-1">
                <Logo textcolor="white" logowidth={45}></Logo>
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

            <div className="logout text-2xl border-t  mt-100">
                <Link to="/" className="flex flex-row items-center  gap-5 pt-5 hover:text-electric-cyan">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <div>Logout </div>
                </Link>

            </div>

        </aside>
    );
}
export default Sidebar;