import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';const ElectricDashboard=()=>{
    const token=localStorage.getItem("token");
    const id=localStorage.getItem("UserId");
    const NID=localStorage.getItem("UserNid");
    
    const [tier,setTier]=useState(0);
    const [rate,setRate]=useState(0);
    const [bill,setBill]=useState(0);
    
    const getUserReadings=async()=>{
       try{ const readings=await axios.get(`http://localhost:3001/logged/user/getTier/${NID}`,
            {"headers":{"authorization":`Bearer ${token}`}});
            console.log(readings);
            setTier(readings.data.currentMonth.tier)
            setRate(readings.data.currentMonth.rate);
            setBill(readings.data.currentMonth.bill);
        }catch(error:any)
        {
            console.log(error.response)
        }

    }
    useEffect(()=>{getUserReadings()},[])
    return(
        <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto my-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart>
                        <CartesianGrid>
                            <XAxis></XAxis>
                            <YAxis></YAxis>
                            <Tooltip ></Tooltip>
                            <Bar></Bar>
                        </CartesianGrid>
                    </BarChart>

                </ResponsiveContainer>
                
            </div>
            <h1>
                <p>tier: {tier}</p>
                <p>rate: {rate}</p>
                <p>bill: {bill}</p>
            </h1>
            
        </>
        
    )

}

export default ElectricDashboard;