import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Logged Comp/Sidebar";

const LoggedRoot=()=>{
    return(
    <div className="flex flex-row justify-between">
        <Sidebar/>
        <Outlet/>
    </div>
    );
}

export default LoggedRoot;