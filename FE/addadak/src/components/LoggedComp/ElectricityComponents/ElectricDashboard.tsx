
import TierDashboard from "./ElectricityTierDashboard";
import { useAuth } from "../../../Contexts/AuthContext";
import ElectricityChartDashboard from "./ElectricityChartDashboard";

import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import api from "../../../api/axios.tsx";

const ElectricDashboard=()=>{

    const navigate=useNavigate();

    const {nid}=useAuth()!;
    const[meters,setMeters]=useState([]);
    const [userTier,setUserTier]=useState(0);
    const [meterNo,setMeterNo]=useState("");
    const [chartData,setChartdata]=useState([]);
    console.log(nid)
    const getUserMeters=async()=>{
       try{
         const userMeters= await api.elecApi.get(`/viewAllMeters/${nid}`,{withCredentials: true })
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
       if (msg ==="jwt expired"){
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

    const getUserTier=async(currentMeterNumber:string)=>{
        try{
            const tier= await api.elecApi.get(`/getTier/${nid}/${currentMeterNumber}`,{withCredentials: true }) ;
            setUserTier(tier.data.tier);
        }catch(error:any){
            const msg=error.response.data.message||error.response.data.msg
            if (msg ==="jwt expired"){
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


     const getUserReadings=async(selectedMeterNo: string)=>{
            
           try{ 
            
            const userConsumtions= await api.elecApi.get(`/getUserConsumptions/${nid}/${selectedMeterNo}`,{withCredentials: true });
            console.log(userConsumtions);
            setChartdata(userConsumtions.data.consumptionTable);
            
            
            
            }catch(error:any)
            {
                
                const msg=error.response.data.message||error.response.data.msg;
                console.log(msg);
                if (msg ==="jwt expired"){
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
    useEffect(()=>{
        getUserMeters();
        
    },[])
    
         console.log(chartData)
    return(
        <div className="flex flex-col w-fill duration-300 transition-all min-w-0 justify-around  items-around pt-10 sm:flex-row">
            
        

            
                <div className="flex  flex-col w-fill min-w-0  items-center justify-start gap-18 ">
                   <div className="border border-secondary-purple rounded-2xl px-4 py-3 flex flex-col gap-6">
                    <h1 className="text-secondary-purple text-2xl " > Owned Meters</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4  gap-6  w-fill max-w-7xl  ">
                         
                        {meters && meters.length > 0 ? 
                        (
                                meters.map((ele, index) => {
                                    const currentMeterNumber = ele._id.meterNumber;
                                    const currentMeterType = ele._id.meterType;
                                    const currentAddress = ele._id.address;
                                    

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (currentMeterNumber) {
                                                    setMeterNo(currentMeterNumber); 
                                                    getUserTier(currentMeterNumber); 
                                                    getUserReadings(currentMeterNumber);
                                                }
                                            }}
                                            className={`rounded-3xl py-4 px-12 border shadow-md flex flex-col justify-center items-center text-center transition-all duration-300 w-full h-24 hover:-translate-y-1 ${
                                                meterNo === currentMeterNumber 
                                                    ? "border-gas-yellow bg-secondary-purple transition-all duration-300 scale-112 text-gas-yellow font-bold " 
                                                    : "border-gray-200 bg-secondary-purple text-gray-300"
                                            }`}
                                        >
                                            
                                            <p className="font-bold text-base">{currentMeterType || " No type"}</p>
                                            <p className="0 font-medium">{currentMeterNumber || "No Number"}</p>
                                            <p className="text-sm ">{currentAddress || "No address"}</p>
                                        </button>
                                    );
                                })
                            ) : (<p className="text-gray-500 text-center">No Meters for this user  </p>)}

                    </div>
                </div>
                   
                {chartData && chartData.length > 0 ? 
                (
                    <ElectricityChartDashboard chartData={chartData} />
                ) : 
                (
                    <div className="text-gray-400 text-sm italic py-20">Loading data ...</div>
                )}
                
            </div>
            
            <TierDashboard userTier={userTier}></TierDashboard>

        </div>
    )
}


export default ElectricDashboard;