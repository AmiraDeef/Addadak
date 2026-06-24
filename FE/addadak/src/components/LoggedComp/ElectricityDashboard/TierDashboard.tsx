import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const TierDashboard=(userTier:any)=>{
    const [allTiers,setAllTiers]=useState([]);
    const viewAllTiers=async()=>{
        const viewallTiers= await axios.get(`http://localhost:3001/logged/user/viewAllTiers`) ;
        const sevenTiers=viewallTiers.data.Tiers
        setAllTiers(sevenTiers);
        console.log(sevenTiers);
        console.log(allTiers)

    }
    useEffect(()=>{viewAllTiers()},[])
    return (
        <div className="flex flex-row justify-around w-300  p-3 m-3 "> 
            {
                allTiers.map((ele:any,index:number)=>{
                    return (
                            <div key={index} className={`rounded-full w-35 h-35 shadow-xl flex flex-col justify-center p-5 items-center text-center `} style={{backgroundColor: `${ele.color}50`, }} >
                                
                                
                                    <p>Tier: {ele.tier}</p>
                                    <p>Rate: {ele.rate} </p> 
                                    <small>EGP/kWh</small>

                               
                                
                            </div>
                    )
                })
            }

        </div>
    );
}

export default TierDashboard;