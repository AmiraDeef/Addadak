import { Outlet } from "react-router-dom";
import { useSelector,useDispatch } from 'react-redux'
import TierDashboard from "../../../components/shared/TierDashboard.tsx";
import OwnedMeters from "../../../components/shared/OwnedMeters.tsx";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import api from "../../../api/axios.tsx";
import type{ RootState,AppDispatch } from '../../../store/store.tsx';
import { consumptions } from "../../../store/utilitySlice.tsx";

const Dashboard=()=>{

    const navigate=useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const {nid}=useSelector((state:RootState)=>state.auth)
    
    const[meters,setMeters]=useState([]);
    const [userTier,setUserTier]=useState(0);
    const [meterNo,setMeterNo]=useState("");
    const [chartData,setChartdata]=useState([]);

    
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
            dispatch(consumptions(userConsumtions.data.consumptionTable));
            const {consumps}=useSelector((state:RootState)=>state.utility)
            console.log(consumps)
            
            
            }catch(error:any)
            {
                
                const msg=error.response.data.message||error.response.data.msg;
                
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
    

    return(
        <div className="flex flex-col w-fill duration-300 transition-all min-w-0 justify-around gap-80 pt-10 sm:flex-row">

            <div className="flex  flex-col w-fill min-w-0  items-center  gap-18 ">
                <OwnedMeters meters={meters} getUserReadings={getUserReadings } getUserTier={getUserTier}/>
                
                {chartData && chartData.length > 0 ? 
                (
                    <Outlet></Outlet>
                ) : 
                (
                    <div className="text-gray-400 text-sm italic py-20">Loading data ...</div>
                )}
                
            </div>
            
            <TierDashboard userTier={userTier}></TierDashboard>

        </div>
    )
}


export default Dashboard;