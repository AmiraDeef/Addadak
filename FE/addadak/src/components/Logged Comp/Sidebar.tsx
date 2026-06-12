import type { ReactElement } from "react";
import Logo from "../Logo";

const Sidebar=()=>{

   
    interface tabstemp{
        icon:ReactElement,
        title:string
    }
    const tabs:Array<tabstemp>=[
        {icon:<i className="fa-regular fa-circle-user"></i>, title:"Profile"},
        {icon:<i className="fa-solid fa-chart-line"></i> ,title:"Dashboard"},
        {icon:<i className="fa-solid fa-eye"></i>,title:"Forecast"},
        {icon:<i className="fa-regular fa-credit-card"></i>,title:"My credit"}

    ]
    return(
        <aside className="bg-secondary-purple flex flex-col text-my-white">
            <div className="title">
                <Logo textcolor="white" logowidth={65}></Logo>
            </div>

            <div className="tabs">
                {
                    tabs.map((ele,index)=>{
                        return(
                            <div key={index} className={`${ele.title} flex flex-row justify-around`}>
                                <div>{ele.icon}</div>
                                <div>{ele.title}</div>
                            </div>

                        );
                    })
                }

            </div>

        </aside>
    );
}
export default Sidebar;