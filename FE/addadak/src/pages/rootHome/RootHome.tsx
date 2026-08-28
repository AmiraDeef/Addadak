import RootHeader from "../../components/RootHomeComp/RootHeader";
import { Outlet } from "react-router-dom";

const RootHome = () => {
    return (
        <div className="min-h-screen w-full flex flex-col overflow-x-hidden">
            <RootHeader />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
        </div>

    );
}
export default RootHome;