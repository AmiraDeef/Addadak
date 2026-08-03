import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import TierDashboard from "../../../components/shared/TierDashboard.tsx";
import OwnedMeters from "../../../components/shared/OwnedMeters.tsx";
import { useEffect, useState, useCallback } from "react";
import Swal from 'sweetalert2';
import api from "../../../api/axios.tsx";
import type { RootState, AppDispatch } from '../../../store/store.tsx';
import { consumptions } from "../../../store/consumptionSlice.tsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { nid } = useSelector((state: RootState) => state.auth);
    const { utility } = useSelector((state: RootState) => state.utility);

    const [meters, setMeters] = useState([]);
    const [userTier, setUserTier] = useState(0);
    const [chartData, setChartdata] = useState([]);

    const getEndpoints = useCallback(() => {
        const base = utility === "water" ? "/waterApi" : utility === "gas" ? "/gasApi" : "";
        return {
            allMeters: `${base}/viewAllMeters/${nid}`,
            utilityTiers: `${base}/getTier/${nid}`,
            userConsumptions: `${base}/getUserConsumptions/${nid}`
        };
    }, [nid, utility]);

    const getUserTier = async (currentMeterNumber: string) => {
        const endpoints = getEndpoints();
        try {
            const tier = await api.elecApi.get(`${endpoints.utilityTiers}/${currentMeterNumber}`, { withCredentials: true });
            setUserTier(tier.data.tier);
        } catch (error: any) {
            handleError(error);
        }
    };

    const getUserReadings = async (selectedMeterNo: string) => {
        const endpoints = getEndpoints();
        try {
            const userConsumtions = await api.elecApi.get(`${endpoints.userConsumptions}/${selectedMeterNo}`, { withCredentials: true });
            setChartdata(userConsumtions.data.consumptionTable);
            dispatch(consumptions(userConsumtions.data));
        } catch (error: any) {
            handleError(error);
        }
    };

    const getUserMeters = async () => {
        const endpoints = getEndpoints();
        try {
            const userMeters = await api.elecApi.get(endpoints.allMeters, { withCredentials: true });
            const fetchedMeters = userMeters.data.meters;
            setMeters(fetchedMeters);

            if (fetchedMeters && fetchedMeters.length > 0) {
                const firstMeterNumber = fetchedMeters[0]._id?.meterNumber;
                if (firstMeterNumber) {
                    getUserTier(firstMeterNumber);
                    getUserReadings(firstMeterNumber);
                }
            }
        } catch (error: any) {
            handleError(error);
        }
    };

    const handleError = (error: any) => {
        const msg = error.response?.data?.message || error.response?.data?.msg || "Error occurred";
        if (msg === "jwt expired") {
            Swal.fire({
                title: 'Session Expired!',
                text: 'Please login again.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            navigate("/user/login");
        }
    };

    useEffect(() => {
        if (nid) {
            getUserMeters();
        }
    }, [nid, utility]);

    return (
        <div className="flex flex-col w-fill duration-300 transition-all min-w-0 justify-around gap-10 pt-10 sm:flex-row">
            <div className="flex flex-col w-250 min-w-0 items-center gap-8">
                <OwnedMeters meters={meters} getUserReadings={getUserReadings} getUserTier={getUserTier} />
                
                {chartData && chartData.length > 0 ? (
                    <Outlet />
                ) : (
                    <div className="text-gray-400 text-sm italic py-20">Loading data ...</div>
                )}
            </div>
            
            <TierDashboard userTier={userTier} />
        </div>
    );
};

export default Dashboard;