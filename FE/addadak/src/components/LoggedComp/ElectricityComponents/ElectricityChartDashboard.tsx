
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface chartprop{
    chartData:Array<object>
}

const ElectricityChartDashboard=({chartData}:chartprop)=>{
    console.log(chartData)
    
    return(
        <>
            <div className="bg-gray-100/10 p-6 rounded-2xl shadow-lg border border-gray-100 max-w-2xl  " style={{ width: '100%', height: 500 }}>
                <ResponsiveContainer width="100%" height="100%" >
                    <BarChart data={chartData} barSize={35}>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#9d9e9e"/>
                        <XAxis dataKey="month" stroke="#64686e" fontSize={12} tickLine={false}/>
                        <YAxis stroke="#64686e" fontSize={12} tickLine={false} axisLine={false}></YAxis>
                        <Tooltip cursor={{ fill: '#abb0b6' }}></Tooltip>
                        <Bar dataKey="consumption" fill="#3B82F6" radius={[6, 6, 0, 0]}></Bar>
                        
                        
                    </BarChart>

                </ResponsiveContainer>
                
            </div>
           
            
        </>
        
    )

}

export default ElectricityChartDashboard;