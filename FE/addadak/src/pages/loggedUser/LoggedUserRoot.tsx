import { Outlet } from "react-router-dom";
import Sidebar from "../../components/LoggedComp/Sidebar";
import LoggedHeader from "../../components/LoggedComp/LoggedHeader";

const LoggedRoot=()=>{
    return(
    <div className="flex flex-row h-screen w-full overflow-hidden justify-start">
        <Sidebar/>
        <div className="leftside flex flex-col flex-1 h-full  min-w-0">
            <LoggedHeader title="Dasboard"></LoggedHeader>
            <Outlet/>
        </div>
        
    </div>
    );
}

export default LoggedRoot;