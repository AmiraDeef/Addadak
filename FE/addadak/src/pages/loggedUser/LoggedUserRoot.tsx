import { Outlet } from "react-router-dom";
import Sidebar from "../../components/LoggedComp/Sidebar";
import LoggedHeader from "../../components/LoggedComp/LoggedHeader";

const LoggedRoot=()=>{
    return(
    <div className="flex flex-row h-screen w-full  justify-start items-start">
        <Sidebar/>
        <div className="leftside flex flex-col flex-1 h-screen w-screen pl-0 ">
            <LoggedHeader title="Dasboard"></LoggedHeader>
            
            <Outlet />
            
        </div>
        
    </div>
    );
}

export default LoggedRoot;