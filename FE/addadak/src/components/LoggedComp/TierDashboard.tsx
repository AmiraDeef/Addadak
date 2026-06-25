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
        <div className="flex flex-col justify-around w-150 gap-3  p-3 m-3 "> 
            {
                allTiers.map((ele:any,index:number)=>{
                    return (
                            <div key={index} className={`rounded-3xl py-3 w-65 border   gap-3 h-15 shadow-xl flex flex-row justify-center p-5 items-center text-center ${
                                allTiers.forEach(element => {
                                    (element===userTier)?`border-secondary-purple text-secondary purple bg-my-white/30`:`bg-secondary-purple text-electric-cyan border-electric-cyan`
                                })
                            }`} style={{backgroundColor: `${ele.color}50`, }} >
                                
                                
                                    <p>Tier: {ele.tier}</p>
                                    <p>Rate: {ele.rate} <small>EGP/kWh</small></p> 
                                    

                               
                                
                            </div>
                    )
                })
            }

        </div>
    );
}

export default TierDashboard;