import { useState, useEffect,useCallback } from "react";
import api from "../../api/axios.tsx";
import { useSelector, } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store.tsx';
interface Tier {
    tier: number;
    rate: number;
}

interface props {
    userTier: number;
}

const TierDashboard = ({ userTier }: props) => {
    const [allTiers, setAllTiers] = useState<Tier[]>([]);
    const { utility } = useSelector((state: RootState) => state.utility); 
    const { nid } = useSelector((state: RootState) => state.auth);
    const getEndpoints = useCallback(() => {
        const base = utility === "Water" ? "/water" : utility === "Gas" ? "/gas" : "/elec";
        return {
            allMeters: `${base}/viewAllTiers`,
        };
    }, [nid, utility]);
    const viewAllTiers = async () => {
        try {
            const endpoints = getEndpoints();
            console.log("endpoint ",endpoints.allMeters)
            const viewallTiers = await api.elecApi.get(endpoints.allMeters)
            console.log("view all tiers ",viewallTiers)
            const sevenTiers = viewallTiers.data.Tiers;
            setAllTiers(sevenTiers);
        } catch (error) {
            console.error("Error fetching tiers:", error);
        }
    };

    useEffect(() => {
        viewAllTiers();
        console.log(utility);
    }, [nid, utility]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border border-secondary-purple lg:grid-cols-1 gap-4 p-6 w-fill max-w-5xl flex flex-col  rounded-2xl gap-5"> 
            <div><h1 className="text-secondary-purple text-2xl">Consumption tiers</h1></div>
            
            {
                
                allTiers.map((ele: Tier, index: number) => {
                    const isSelected = ele.tier === userTier;

                    return (
                        <div 
                            key={index} 
                            className={`rounded-3xl gap-5 py-4 px-6 border shadow-md flex flex-row justify-between items-center text-center transition-all duration-300 w-75 h-20 hover:-translate-y-3
                                ${isSelected 
                                    ? 'bg-secondary-purple text-gas-yellow  scale-110 font-bold  ' 
                                    : 'border-secondary-purple text-secondary-purple    bg-my-white/30'
                                }`
                            }
                        >
                            <p className="text-lg"> <small> </small> Tier : {ele.tier} </p>
                            
                            <p className="text-base">
                                <small> </small>Rate: <span className="font-bold">{ele.rate}</span> <small className="text-xs">EGP/kWh</small>
                            </p> 
                        </div>
                    )
                })
            }
        </div>
    );
};

export default TierDashboard;