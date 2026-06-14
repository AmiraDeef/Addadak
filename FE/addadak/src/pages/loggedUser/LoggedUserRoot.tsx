import { Outlet } from "react-router-dom";
import Sidebar from "../../components/LoggedComp/Sidebar";
import LoggedHeader from "../../components/LoggedComp/LoggedHeader";

const LoggedRoot=()=>{
    return(
    <div className="flex flex-row justify-start">
        <Sidebar/>
        <div className="leftside w-screen">
            <LoggedHeader title="Dasboard"></LoggedHeader>
            <Outlet/>
        </div>
        
    </div>
    );
}

export default LoggedRoot;