import type { ReactElement } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Logo from "../Badges/Logo";
import { logout } from "../../store/authSlice";
import type { AppDispatch } from "../../store/store";

interface SidebarProps {
    onClose?: () => void;
}

interface TabItem {
    icon: ReactElement;
    title: string;
    link: string;
}

const Sidebar = ({ onClose }: SidebarProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/user/login");
    };

    const tabs: TabItem[] = [
        { icon: <i className="fa-regular fa-circle-user"></i>, title: "Profile", link: "/logged/user/profile" },
        { icon: <i className="fa-solid fa-chart-line"></i>, title: "Dashboard", link: "/logged/user/dashboard/chart" },
        { icon: <i className="fa-solid fa-eye"></i>, title: "Forecast", link: "/logged/user/dashboard/forecast" },
        { icon: <i className="fa-regular fa-credit-card"></i>, title: "My wallet", link: "/logged/user/dashboard/credit" }
    ];

    return (
        <aside className="bg-secondary-purple flex flex-col text-my-white px-6 py-1.5 w-[280px] md:w-[250px] lg:w-[340px] h-full shadow-lg md:shadow-none">
            {/* Top Bar inside Sidebar with Close Button on Mobile */}
            <div className="title border-b-1 flex items-center justify-between">
                <Logo textcolor="white" logowidth={55} />
                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden text-my-white hover:text-electric-cyan text-xl p-2"
                        aria-label="Close sidebar"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )}
            </div>

            <div className="tabs flex flex-col gap-10 pt-10 text-2xl">
                {tabs.map((ele, index) => (
                    <div key={index} className={ele.title}>
                        <NavLink
                            to={ele.link}
                            onClick={onClose} // Closes off-canvas drawer on item click
                            className={({ isActive }: { isActive: boolean }): string =>
                                `flex flex-row gap-5 hover:text-electric-cyan ${
                                    isActive ? "text-electric-cyan" : "text-my-white"
                                }`
                            }
                        >
                            <div>{ele.icon}</div>
                            <div>{ele.title}</div>
                        </NavLink>
                    </div>
                ))}
            </div>

            <div className="logout text-xl border-t border-white/20 mt-auto pb-4">
                <button
                    type="button"
                    className="flex flex-row items-center gap-5 pt-5 hover:text-electric-cyan w-full text-left"
                    onClick={handleLogout}
                >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <div>Logout</div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;