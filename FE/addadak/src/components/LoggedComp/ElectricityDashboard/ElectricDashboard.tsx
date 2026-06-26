import ChartDashboard from "../ChartDashboard";
import TierDashboard from "../TierDashboard";
import axios from "axios";
import { useEffect,useState } from "react";

const ElectricDashboard=()=>{

    const token=localStorage.getItem("token");
    //const id=localStorage.getItem("UserId");
    const NID=localStorage.getItem("UserNid");


    const [userTier,setUserTier]=useState(0);
    const getUserTier=async()=>{
        const tier= await axios.get(`http://localhost:3001/logged/user/getTier/${NID}`,{"headers":{"authorization":`Bearer ${token}`}}) ;
        console.log(tier)
        setUserTier(tier.data.tier);
       
        

    }
    useEffect(()=>{getUserTier()},[])
    return(
        <div className="flex pt-5 flex-col w-fill min-w-0 justify-center gap-2 items-center md:flex-row">

            <ChartDashboard></ChartDashboard>
            <TierDashboard userTier={userTier}></TierDashboard>

        </div>
    )
}

export default ElectricDashboard;