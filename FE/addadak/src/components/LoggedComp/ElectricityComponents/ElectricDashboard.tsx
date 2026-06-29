
import TierDashboard from "./ElectricityTierDashboard";

import ElectricityChartDashboard from "./ElectricityChartDashboard";
import axios from "axios";
import { useEffect,useState } from "react";

const ElectricDashboard=()=>{

    const token=localStorage.getItem("token")|| " ";
    //const id=localStorage.getItem("UserId");
    const NID=localStorage.getItem("UserNid")|| " ";

    const[meters,setMeters]=useState([]);
    const [userTier,setUserTier]=useState(0);
    const [meterNo,setMeterNo]=useState("");
     const [chartData,setChartdata]=useState([]);

    const getUserMeters=async()=>{
       try{
         const userMeters= await axios.get(`http://localhost:3001/logged/user/viewAllMeters/${NID}`,{"headers":{"authorization":`Bearer ${token}`}})
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
        alert(msg);
    }
};

    const getUserTier=async(currentMeterNumber:string)=>{
        try{
            const tier= await axios.get(`http://localhost:3001/logged/user/getTier/${NID}/${currentMeterNumber}`,{"headers":{"authorization":`Bearer ${token}`}}) ;
            setUserTier(tier.data.tier);
        }catch(error:any){
            const msg=error.response.data.message||error.response.data.msg
            alert(msg);
        }
    }


     const getUserReadings=async(selectedMeterNo: string)=>{
            
           try{ 
            
            const userConsumtions= await axios.get(`http://localhost:3001/logged/user/getUserConsumptions/${NID}/${selectedMeterNo}`,{"headers":{"authorization":`Bearer ${token}`}});
            console.log(userConsumtions);
            setChartdata(userConsumtions.data.consumptionTable);
            
            
            
            }catch(error:any)
            {
                console.log(error.response)
            }
    
        }
    useEffect(()=>{
        getUserMeters();
        
    },[])
    
         console.log(chartData)
    return(
        <div className="flex flex-col w-fill  min-w-0 justify-center  items-around pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4  gap-4 p-4 w-fill max-w-7xl mx-auto ">
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
                ) : (<p className="text-gray-500 text-center">No Meters for this user  </p>)}

            </div>


            <div className="flex pt-5 flex-col w-fill min-w-0 justify-around  items-center md:flex-row">

                {chartData && chartData.length > 0 ? 
                (
                    <ElectricityChartDashboard chartData={chartData} />
                ) : 
                (
                    <div className="text-gray-400 text-sm italic py-20">Loading data ...</div>
                )}
                <TierDashboard userTier={userTier}></TierDashboard>
            </div>
            

        </div>
    )
}


export default ElectricDashboard;