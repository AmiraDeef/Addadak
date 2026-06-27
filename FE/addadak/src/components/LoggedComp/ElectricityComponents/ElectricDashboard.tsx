import ChartDashboard from "../ChartDashboard";
import TierDashboard from "../TierDashboard";
import MeterDashboard from "../MetersDashboard";
import axios from "axios";
import { useEffect,useState } from "react";

const ElectricDashboard=()=>{

    const token=localStorage.getItem("token");
    //const id=localStorage.getItem("UserId");
    const NID=localStorage.getItem("UserNid");

    const[meters,setMeters]=useState([]);
    const [userTier,setUserTier]=useState(0);
    const getUserMeters=async()=>{
       try{
         const userMeters= await axios.get(`http://localhost:3001/logged/user/viewAllMeters/${NID}`,{"headers":{"authorization":`Bearer ${token}`}})
         setMeters(userMeters.data.meters._id)
        }catch(error:any){
            const msg=error.response.data.message||error.response.data.msg
            alert(msg);

    }


    const getUserTier=async()=>{
        try{
            const tier= await axios.get(`http://localhost:3001/logged/user/getTier/${NID}`,{"headers":{"authorization":`Bearer ${token}`}}) ;
            console.log(tier)
            setUserTier(tier.data.tier);
        }catch(error:any){
            const msg=error.response.data.message||error.response.data.msg
            alert(msg);
        }
    }
    useEffect(
        ()=>{
            getUserMeters();
            getUserTier();
        }
       
    ,[])
    return(
        <div className="flex flex-col w-fill  min-w-0 justify-center gap-2 items-center">
            <div>
                <MeterDashboard ></MeterDashboard>

            </div>


            <div className="flex pt-5 flex-col w-fill min-w-0 justify-center gap-2 items-center md:flex-row">
                <ChartDashboard></ChartDashboard>
                <TierDashboard userTier={userTier}></TierDashboard>
            </div>
            

        </div>
    )
}
}

export default ElectricDashboard;