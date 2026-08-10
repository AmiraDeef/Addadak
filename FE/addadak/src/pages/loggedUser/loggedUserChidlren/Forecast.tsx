import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { useEffect, useState, useCallback } from 'react';
import api from "../../../api/axios.tsx";
import { Zap, Droplet, Flame, Lightbulb, AlertCircle, Loader2 } from 'lucide-react';

const Forecast = () => {
    const { meterNumber } = useSelector((state: RootState) => state.meter);
    const { nid } = useSelector((state: RootState) => state.auth);
    const { utility } = useSelector((state: RootState) => state.utility);

    const [status, setStatus] = useState<number | null>(null);
    const [predicted, setPredicted] = useState<number | null>(null);
    const [predictionMonth, setPredictionMonth] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    
    const getUtilityConfig = () => {
        const lowerUtility = utility?.toLowerCase();
        switch (lowerUtility) {
            case 'electricity':
                return {
                    color: '#2FD2E3', // Cyan from sidebar/toggle
                    badgeBg: 'bg-cyan-500/10 text-cyan-700 border-cyan-300',
                    unit: 'kWh',
                    icon: <Zap className="w-5 h-5 text-cyan-500" />,
                    tip: "Pro-Tip: Shift high-power appliance usage (washing machines, water heaters) to off-peak hours to manage monthly consumption peaks."
                };
            case 'water':
                return {
                    color: '#2563EB', // Blue
                    badgeBg: 'bg-blue-500/10 text-blue-700 border-blue-300',
                    unit: 'm³',
                    icon: <Droplet className="w-5 h-5 text-blue-500" />,
                    tip: "Pro-Tip: Fixing a single slow tap leak can save over 300 liters of water per month and help keep you in lower pricing tiers!"
                };
            case 'gas':
                return {
                    color: '#EAA000', // Gold / Amber
                    badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-300',
                    unit: 'm³',
                    icon: <Flame className="w-5 h-5 text-amber-500" />,
                    tip: "Pro-Tip: Ensure water heaters are set to optimal eco-temperatures (around 50°C) to prevent unnecessary gas consumption."
                };
            default:
                return {
                    color: '#6B7280',
                    badgeBg: 'bg-gray-500/10 text-gray-700 border-gray-300',
                    unit: 'units',
                    icon: <Zap className="w-5 h-5 text-gray-500" />,
                    tip: "Pro-Tip: Monitor your historical usage regular intervals to stay ahead of tier jumps."
                };
        }
    };

    const config = getUtilityConfig();

    const getPrediction = useCallback(async () => {
        if (!meterNumber || !nid || !utility) return;
        
        setLoading(true);
        try {
            const predictedValue = await api.forecastApi.get(`/${nid}/${utility}/${meterNumber}`);
            setStatus(predictedValue.status);
            setPredicted(predictedValue.data.prediction);
            setPredictionMonth(predictedValue.data.calculatedForMonth);
        } catch (error: any) {
            console.error("Forecast Error:", error);
            setStatus(error.response?.status || 500);
        } finally {
            setLoading(false);
        }
    }, [meterNumber, nid, utility]);

    useEffect(() => {
        getPrediction();
    }, [getPrediction]);

    // Format Month name from number (e.g., 8 -> August)
    const getMonthName = (monthNumber: number | null) => {
        if (!monthNumber) return '';
        const date = new Date(2026, monthNumber - 1, 1);
        return date.toLocaleString('default', { month: 'long' });
    };

    return (
        <div className="w-full max-w-2xl bg-[#EBE8E1]/60 backdrop-blur-md p-6 rounded-3xl border border-gray-300/80 shadow-sm flex flex-col justify-between min-h-[460px] transition-all duration-300">
            
            {/* 1. Header with Utility Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-300/60">
                <div className="flex items-center gap-2">
                    {config.icon}
                    <h3 className="font-semibold text-gray-800 text-lg">AI Consumption Forecast</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${config.badgeBg}`}>
                    {utility || 'Utility'}
                </span>
            </div>

            {/* 2. Main Content Body */}
            {loading ? (
                <div className="flex flex-col items-center justify-center my-auto py-12 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-900" />
                    <p className="text-sm text-gray-500 font-medium">Analyzing past trends...</p>
                </div>
            ) : status === 200 && predicted !== null ? (
                <div className="flex flex-col items-center justify-center my-auto py-6 gap-3">
                    <p className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                        Estimated Usage for <span className="text-purple-950 font-bold">{getMonthName(predictionMonth)}</span>
                    </p>
                    
                    {/* Hero Metric Box with Accent Color */}
                    <div 
                        className="flex items-baseline gap-2 px-10 py-5 rounded-2xl bg-white shadow-md border-2 transition-all duration-300 transform hover:scale-[1.02]"
                        style={{ borderColor: config.color }}
                    >
                        <span className="text-5xl font-black text-purple-950 tracking-tight">
                            {predicted.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-lg font-bold text-gray-500">{config.unit}</span>
                    </div>
                </div>
            ) : (
                /* Insufficient Data State */
                <div className="flex flex-col items-center justify-center my-auto py-10 gap-3 text-center px-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Insufficient Data</h4>
                    <p className="text-xs text-gray-500 max-w-sm">
                        At least 6 consecutive months of billing history are required to build an accurate forecast model for this meter.
                    </p>
                </div>
            )}

            {/* 3. Footer: Pro-Tip & Disclaimer */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-300/60">
                {/* Pro Tip Box */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-950/5 border border-purple-900/10 text-xs text-purple-950">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-medium">{config.tip}</p>
                </div>

                {/* Disclaimer Text */}
                <p className="text-[11px] text-gray-500 italic text-center">
                    Note: Predictions are AI-generated estimates based on past usage trends. Actual future consumption may vary.
                </p>
            </div>
        </div>
    );
};

export default Forecast;