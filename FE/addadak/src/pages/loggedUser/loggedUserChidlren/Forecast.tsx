import { useSelector } from 'react-redux'
import type{ RootState } from '../../../store/store';
import { useEffect } from 'react';
import api from "../../../api/axios.tsx";

const Forecast=()=>{
    const {meterNumber}=useSelector((state:RootState)=>state.meter)
    const { nid } = useSelector((state: RootState) => state.auth);
    const {utility}=useSelector((state:RootState)=>state.utility)
    console.log(meterNumber);
    console.log(nid)
    console.log(utility)
    const getPrediction=async ()=>{
        try{
            const predictedValue= await api.forecastApi.get(`/${nid}/${utility}/${meterNumber}`);
            console.log(predictedValue);
            
        }catch(error){
            console.log(error)
        }
        
    }
    useEffect(()=>{
        
            getPrediction();
        
    },[meterNumber,nid,utility])
return(
    <>
        <div className="bg-gray-100/10 p-6 rounded-2xl shadow-lg border border-gray-100 max-w-2xl flex flex-col items-center " style={{ width: '100%', height: 500 }}>
            <i className='text-black-100/70'>Note: Predictions are AI-generated estimates based on past usage trends. Actual future consumption may vary and should be used as a general guide only.</i>
        </div>
    </>
)
}
export default Forecast;