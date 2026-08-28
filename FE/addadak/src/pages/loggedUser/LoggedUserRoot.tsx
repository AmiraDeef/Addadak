import { Outlet } from "react-router-dom";
import Sidebar from "../../components/shared/Sidebar";
import LoggedHeader from "../../components/shared/LoggedHeader";

const LoggedRoot=()=>{
    return(
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                <LoggedHeader />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default LoggedRoot;