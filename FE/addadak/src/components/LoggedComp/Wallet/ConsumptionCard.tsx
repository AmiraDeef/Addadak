import { useState,useEffect } from "react";
import { Zap, Brain, CreditCard, Calendar, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../../Contexts/AuthContext";
import api from "../../../api/axios"
import { StripeModal } from "./StripeModal";


interface meterReadings{
    meterNumber:string;
    lastConsumption:number;
    lastReading:number;
    lastCharged:number;
    autoPay:boolean;
    payingDate: string

}

const ConsumptionCard = ({ meterNumber }: { meterNumber?: string }) => {

const auth=useAuth()
const userNId=auth?.nid
const userId=auth?.id

const [clientSecret, setClientSecret] = useState<string | null>(null);
const [showModal, setShowModal] = useState(false);



const [meterData,setMeterData]=useState(null);
const [charge,setCharge]=useState(false)
const [error,setError]=useState(null)
const [loading, setLoading] = useState<boolean>(true);


//get amount and consumption 
useEffect(()=>{
    
    
    if (!userId||!meterNumber) return;
    
    const getConsumptions=async () => {
        try {
            // console.log(userNId,meterNumber);
            
            const res=await api.elecApi.get(`/getUserConsumptions/${userNId}/${meterNumber}`,{withCredentials:true})
            console.log(res.data);
            setMeterData(res.data.consumptionTable||res.data)
       
        } catch (error) {
            console.log(error);
            
        }
   
}
getConsumptions();
},[meterNumber, userNId])
 

const handleCharge=async()=>{
    if (!userId||!meterNumber) return;
    try {
        setCharge(true);
        const res=await api.walletApi.post(`chargeMeters/${userNId}/${meterNumber}`,{},{withCredentials:true})
   if(res.data.clientSecret){
    setClientSecret(res.data.clientSecret)
    setShowModal(true)
   }
   const { clientSecret, transaction } = res.data;
   console.log(clientSecret, transaction);
   
   
    } catch (error) {
        console.log(error);
        
        // alert(error.response?.data?.message || "Failed to initiate payment");
    }finally{
        setCharge(false)
    }


}



    return (
        <div className="w-full bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-5">
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
           
                <div className="flex flex-col justify-between space-y-4 md:border-r border-gray-300/40 md:pr-6">
                    <div>
                     
                        <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-secondary-purple)] text-white">
                                <Zap className="w-3.5 h-3.5 text-[var(--color-gas-yellow)]" /> Smart Meter
                            </span>
                            <span className="text-xs text-gray-500 font-mono tracking-wider">
                                {meterNumber}
                            </span>
                        </div>

                     {/* ay 7aga l7ad lama el controller consumption ytzabt */}
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Month Consumption</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-3xl font-extrabold text-[var(--color-secondary-purple)] tracking-tight">
                               140
                            </span>
                            <span className="text-sm font-bold text-gray-500">kWh</span>
                        </div>

                        {/* Sub Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mt-4 bg-white/60 p-3 rounded-xl border border-white/80">
                            <div>
                                <p className="text-[11px] text-gray-400 font-medium">Last Reading</p>
                                <p className="text-sm font-bold text-gray-700">1240 kWh</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-medium">Last Amount Charged</p>
                                <p className="text-sm font-bold text-emerald-600">114 EGP</p>
                            </div>
                        </div>
                    </div>

               
                    <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between bg-white/60 p-2.5 rounded-xl border border-white/80">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-[var(--color-secondary-purple)]" />
                                <span className="text-xs font-bold text-gray-700">AutoPay</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-secondary-purple)]"></div>
                            </label>
                        </div>

                
                        <button 
                        onClick={handleCharge}
                        disabled={charge}
                        className="w-full py-2.5 px-4 bg-[var(--color-secondary-purple)] hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
                            <span>{charge? "Processing..." :"Charge Meter Now"}</span>
                            <ArrowUpRight className="w-4 h-4 text-[var(--color-gas-yellow)]" />
                        </button>
                    </div>
                </div>

             {/* static data untill i get ai api prediction */}
                <div className="flex flex-col justify-between space-y-4">
               
                    <div className="bg-white/60 p-3.5 rounded-xl border border-white/80">
                        <div className="flex items-center gap-1.5 text-[var(--color-secondary-purple)] text-xs font-bold uppercase tracking-wider mb-2">
                            <Brain className="w-4 h-4 text-[var(--color-secondary-purple)]" /> AI Forecast (Next Month)
                        </div>
                        <div className="flex items-baseline justify-between">
                            <div>
                                <p className="text-[11px] text-gray-400 font-medium">Expected Charge</p>
                                <p className="text-xl font-extrabold text-[var(--color-secondary-purple)]">
                                    ~ 145 <span className="text-xs font-semibold">EGP</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[11px] text-gray-400 font-medium">Predicted Usage</p>
                                <p className="text-xs font-bold text-gray-700">
                                    ~ 280 kWh
                                </p>
                            </div>
                        </div>
                    </div>

              
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Recent Charge Dates
                        </h4>
                        <div className="space-y-2">
                            {[
                                { date: "20 Jul 2026", amount: "114 EGP" },
                                { date: "18 Jun 2026", amount: "98 EGP" },
                                { date: "15 May 2026", amount: "85 EGP" }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center text-xs p-2 px-3 rounded-lg bg-white/50 border border-white/70 hover:bg-white/80 transition-colors"
                                >
                                    <span className="font-semibold text-gray-600">{item.date}</span>
                                    <span className="font-bold text-[var(--color-secondary-purple)]">{item.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            {showModal && clientSecret && (
        <StripeModal
          clientSecret={clientSecret}
          onClose={() => setShowModal(false)}
        />
      )}
        </div>
    );
};

export default ConsumptionCard;