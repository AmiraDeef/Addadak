import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ChartDashboard=()=>{
    const token=localStorage.getItem("token");
    const id=localStorage.getItem("UserId");
    const NID=localStorage.getItem("UserNid");
    
    const [tier,setTier]=useState(0);
    const [rate,setRate]=useState(0);
    const [bill,setBill]=useState(0);
    const [chartData,setChartdata]=useState([]);
    
    const getUserReadings=async()=>{
       try{ const readings=await axios.get(`http://localhost:3001/logged/user/getTier/${NID}`,
            {"headers":{"authorization":`Bearer ${token}`}});
            console.log(readings);
            setTier(readings.data.currentMonth.tier)
            setRate(readings.data.currentMonth.rate);
            setBill(readings.data.currentMonth.bill);
            setChartdata(readings.data.lastMonths);
        }catch(error:any)
        {
            console.log(error.response)
        }

    }
    useEffect(()=>{getUserReadings()},[])
    return(
        <>
            <div className="bg-gray-100/10 p-6 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto my-6">
                <ResponsiveContainer width={300} height={300}>
                    <BarChart data={chartData} barSize={35}>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#9d9e9e"/>
                        <XAxis dataKey="billingMonth" stroke="#64686e" fontSize={12} tickLine={false}/>
                        <YAxis stroke="#64686e" fontSize={12} tickLine={false} axisLine={false}></YAxis>
                        <Tooltip cursor={{ fill: '#abb0b6' }}></Tooltip>
                        <Bar dataKey="reading" fill="#3B82F6" radius={[6, 6, 0, 0]}></Bar>
                        
                        
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

export default ChartDashboard;