import { Outlet } from "react-router-dom";

import TierDashboard from "../../../components/shared/TierDashboard.tsx";
import { useAuth } from "../../../Contexts/AuthContext.tsx";
import ChartDashboard from "../../../components/LoggedComp/ElectricityComponents/ChartDashboard.tsx";
import OwnedMeters from "../../../components/shared/OwnedMeters.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import api from "../../../api/axios.tsx";
import work from "../../../assets/construction.png"


const Dashboard = () => {

    const navigate = useNavigate();

    const { nid } = useAuth()!;
    const [meters, setMeters] = useState([]);
    const [userTier, setUserTier] = useState(0);
    const [meterNo, setMeterNo] = useState("");
    const [chartData, setChartdata] = useState([]);

    console.log(nid)
    const getUserMeters = async () => {
        try {
            const userMeters = await api.elecApi.get(`/viewAllMeters/${nid}`, { withCredentials: true })
            const fetchedMeters = userMeters.data.meters;
            setMeters(fetchedMeters);


            if (fetchedMeters && fetchedMeters.length > 0) {
                const firstMeterNumber = fetchedMeters[0]._id?.meterNumber;

                if (firstMeterNumber) {
                    setMeterNo(firstMeterNumber);
                    getUserTier(firstMeterNumber);
                    getUserReadings(firstMeterNumber);
                }
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || error.response?.data?.msg || "Error fetching meters";
            if (msg === "jwt expired") {
                Swal.fire({
                    title: 'Session Expired!',
                    text: 'Please login again.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                navigate("/user/login");

            };
        }
    };

    const getUserTier = async (currentMeterNumber: string) => {
        try {
            const tier = await api.elecApi.get(`/getTier/${nid}/${currentMeterNumber}`, { withCredentials: true });
            setUserTier(tier.data.tier);
        } catch (error: any) {
            const msg = error.response.data.message || error.response.data.msg
            if (msg === "jwt expired") {
                Swal.fire({
                    title: 'Session Expired!',
                    text: 'Please login again.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                navigate("/user/login");

            };
        }
    }


    const getUserReadings = async (selectedMeterNo: string) => {

        try {

            const userConsumtions = await api.elecApi.get(`/getUserConsumptions/${nid}/${selectedMeterNo}`, { withCredentials: true });
            console.log(userConsumtions);
            setChartdata(userConsumtions.data.consumptionTable);



        } catch (error: any) {

            const msg = error.response.data.message || error.response.data.msg;
            console.log(msg);
            if (msg === "jwt expired") {
                Swal.fire({
                    title: 'Session Expired!',
                    text: 'Please login again.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                navigate("/user/login");

            };

        }

    }
    useEffect(() => {
        getUserMeters();

    }, [])

    console.log(chartData)
    return (
        <div className="flex flex-col w-fill duration-300 transition-all min-w-0 justify-around gap-80 pt-10 sm:flex-row">

            <div className="flex  flex-col w-fill min-w-0  items-center  gap-18 ">
                <OwnedMeters meters={meters} getUserReadings={getUserReadings} getUserTier={getUserTier} />

                {chartData && chartData.length > 0 ?
                    (
                        <Outlet context={{ meterNo }}></Outlet>
                    ) :
                    (
                        <div>
                         
                         <p>Loading data ......</p>
                        <div className="w-fill flex justify-center">
                            <img src={work} alt="" width={500}/>
                        </div>
                        </div>
                   
                    )}

            </div>

            <TierDashboard userTier={userTier}></TierDashboard>

        </div>
    )
}


export default Dashboard;