import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface chartprop{
    Nid:string,
    meterNo:string,
    Token:string
}

const ElectricityChartDashboard=({Nid,meterNo,Token}:chartprop)=>{
    
    
   
    const [chartData,setChartdata]=useState([]);
    
    const getUserReadings=async()=>{
       try{ 
        const userConsumtions= await axios.get(`http://localhost:3001/logged/user/getUserConsumptions/${Nid}/${meterNo}`,{"headers":{"authorization":`Bearer ${Token}`}})
        console.log(userConsumtions);
        
        }catch(error:any)
        {
            console.log(error.response)
        }

    }
    
    useEffect(()=>{getUserReadings()},[])
    return(
        <>
            <div className="bg-gray-100/10 p-6 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto ">
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
           
            
        </>
        
    )

}

export default ElectricityChartDashboard;