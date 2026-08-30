import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/shared/Sidebar";
import LoggedHeader from "../../components/shared/LoggedHeader";

const LoggedRoot = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
            {/* Dark Overlay for Mobile & Tablet */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Wrapper */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-50 md:static md:translate-x-0
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                <LoggedHeader onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LoggedRoot;