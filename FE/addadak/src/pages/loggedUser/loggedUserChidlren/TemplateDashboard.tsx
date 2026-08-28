import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import TierDashboard from "../../../components/shared/TierDashboard.tsx";
import OwnedMeters from "../../../components/shared/OwnedMeters.tsx";
import { useEffect, useState, useCallback } from "react";
import Swal from 'sweetalert2';
import api from "../../../api/axios.tsx";
import type { RootState, AppDispatch } from '../../../store/store.tsx';
import { consumptions } from "../../../store/consumptionSlice.tsx";
import {setMeterData} from "../../../store/meterSlice.tsx"
const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { nid } = useSelector((state: RootState) => state.auth);
    const { utility } = useSelector((state: RootState) => state.utility);           
    const [meters, setMeters] = useState([]);
    const [userTier, setUserTier] = useState(0);
    const [chartData, setChartdata] = useState([]);

    const getEndpoints = useCallback(() => {
        const base = utility === "Water" ? "/water" : utility === "Gas" ? "/gas" : "/elec";
        return {
            allMeters: `${base}/viewAllMeters/${nid}`,
            utilityTiers: `${base}/getTier`,
            userConsumptions: `${base}/getUserConsumptions`
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
            console.log("Response with params:", userConsumtions.data);
            setChartdata(userConsumtions.data);
            dispatch(consumptions(userConsumtions.data));
        } catch (error: any) {
            handleError(error);
        }
    };

    const getUserMeters = async () => {
        setMeters([]);
        setChartdata([]);
        setUserTier(0);
        const endpoints = getEndpoints();
        try {
            const userMeters = await api.elecApi.get(endpoints.allMeters, { withCredentials: true });
            console.log(userMeters)
            const fetchedMeters = userMeters.data.meters;
            console.log("fetched")
            console.log(fetchedMeters)
            
            setMeters(fetchedMeters);

            if (fetchedMeters && fetchedMeters.length > 0) {
                const firstMeterNumber = fetchedMeters[0].meterNumber;
                if (firstMeterNumber) {
                    getUserTier(firstMeterNumber);
                    getUserReadings(firstMeterNumber);
                    dispatch(setMeterData({ meterNumber: firstMeterNumber }))
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
        if (nid && utility ) {
            getUserMeters();
        }
    }, [nid, utility]);

    return (
        <div className="flex flex-col lg:flex-row w-full min-w-0 justify-between items-center lg:items-start gap-8 lg:gap-10 py-4 sm:py-6 transition-all duration-300">
            <div className="flex flex-col w-full max-w-3xl min-w-0 items-center gap-8 lg:gap-10">
                <OwnedMeters meters={meters} getUserReadings={getUserReadings} getUserTier={getUserTier} />
                
                {chartData && chartData.length > 0 ? (
                    <div className="w-full min-w-0 flex justify-center">
                        <Outlet />
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full min-h-[200px] text-gray-400 text-sm italic py-10 bg-white/50 rounded-2xl border border-dashed border-gray-200">
                        Loading data ...
                    </div>
                )}
            </div>
            
            <div className="w-full lg:w-auto flex justify-center">
                <TierDashboard userTier={userTier} />
            </div>
        </div>
    );
};

export default Dashboard;