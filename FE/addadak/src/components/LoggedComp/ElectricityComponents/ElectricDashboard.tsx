
import TierDashboard from "./ElectricityTierDashboard";

import ElectricityChartDashboard from "./ElectricityChartDashboard";
import axios from "axios";
import { useEffect,useState } from "react";

const ElectricDashboard=()=>{

    const token=localStorage.getItem("token");
    //const id=localStorage.getItem("UserId");
    const NID=localStorage.getItem("UserNid");

    const[meters,setMeters]=useState([]);
    const [userTier,setUserTier]=useState(0);
    const [meterNo,setMeterNo]=useState("")

    const getUserMeters=async()=>{
       try{
         const userMeters= await axios.get(`http://localhost:3001/logged/user/viewAllMeters/${NID}`,{"headers":{"authorization":`Bearer ${token}`}})
         console.log(userMeters)
         setMeters(...[userMeters.data.meters])
         //setMeterNo(userMeters.data.meters._id[0].meterNumber);
         
        }catch(error:any){
            const msg=error.response.data.message||error.response.data.msg
            alert(msg);

        }
    }


    const getUserTier=async(currentMeterNumber:string)=>{
        try{
            const tier= await axios.get(`http://localhost:3001/logged/user/getTier/${NID}/${currentMeterNumber}`,{"headers":{"authorization":`Bearer ${token}`}}) ;
            console.log(tier)
            setUserTier(tier.data.tier);
        }catch(error:any){
            const msg=error.response.data.message||error.response.data.msg
            alert(msg);
        }
    }
    useEffect(()=>{getUserMeters()},[])
    
         
    return(
        <div className="flex flex-col w-fill  min-w-0 justify-center gap-4 items-center pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4  gap-4 p-4 w-fill max-w-5xl mx-auto ">
               {meters && meters.length > 0 ? (
                meters.map((ele, index) => {
                    const currentMeterNumber = ele._id?.meterNumber;
                    const currentMeterType = ele._id?.meterType;
                    const currentAddress = ele._id?.address;

        return (
            <button
                key={index}
                onClick={() => {
                    if (currentMeterNumber) {
                        setMeterNo(currentMeterNumber); 
                        getUserTier(currentMeterNumber); 
                    }
                }}
                className={`rounded-3xl py-4 px-6 border shadow-md flex flex-col justify-center items-center text-center transition-all duration-300 w-full h-24 hover:-translate-y-1 ${
                    meterNo === currentMeterNumber 
                        ? "border-gas-yellow bg-my-white/33 text-gas-yellow font-bold ring-1 ring-gas-yellow" 
                        : "border-gray-200 bg-white text-gray-700"
                }`}
            >
                
                <p className="font-bold text-base">{currentMeterType || " No type"}</p>
                <p className="text-gray-500 font-medium">{currentMeterNumber || "No Number"}</p>
                <p className="text-sm text-gray-400">{currentAddress || "No address"}</p>
            </button>
        );
    })
) : (
    <p className="text-gray-500 text-center">No Meters for this user  </p>
)}

            </div>


            <div className="flex pt-5 flex-col w-fill min-w-0 justify-center gap-2 items-center md:flex-row">

                <ElectricityChartDashboard NID={NID} meterNo={meterNo} token={token}></ElectricityChartDashboard>
                <TierDashboard userTier={userTier}></TierDashboard>
            </div>
            

        </div>
    )
}


export default ElectricDashboard;