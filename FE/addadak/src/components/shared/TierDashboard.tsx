import { useState, useEffect, useCallback } from "react";
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
            console.log("endpoint ", endpoints.allMeters)
            const viewallTiers = await api.elecApi.get(endpoints.allMeters)
            console.log("view all tiers ", viewallTiers)
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
        <div className="w-full max-w-5xl border border-secondary-purple rounded-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
            <h1 className="text-secondary-purple text-xl sm:text-2xl font-bold text-center sm:text-left">
                Consumption Tiers
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4 w-full">
                {allTiers && allTiers.length > 0 ? (
                    allTiers.map((ele: Tier, index: number) => {
                        const isSelected = ele.tier === userTier;

                        return (
                            <div
                                key={index}
                                className={`rounded-2xl sm:rounded-3xl py-3 px-4 sm:px-6 border shadow-md flex flex-row justify-between items-center text-center transition-all duration-300 w-full min-h-[64px] hover:-translate-y-1
                                    ${isSelected
                                        ? 'bg-secondary-purple border-secondary-purple text-gas-yellow scale-[1.02] sm:scale-105 font-bold shadow-lg'
                                        : 'border-secondary-purple/40 text-secondary-purple bg-my-white/30 hover:border-secondary-purple'
                                    }`
                                }
                            >
                                <p className="text-base sm:text-lg">
                                    Tier : {ele.tier}
                                </p>

                                <p className="text-sm sm:text-base">
                                    Rate: <span className="font-bold">{ele.rate}</span> <small className="text-xs">EGP/kWh</small>
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className="col-span-full text-gray-400 text-sm text-center py-4 italic">
                        No tiers available
                    </p>
                )}
            </div>
        </div>
    );
};

export default TierDashboard;