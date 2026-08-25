import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import ConsumptionCard from "../../../components/LoggedComp/Wallet/ConsumptionCard";
import TransTable from "../../../components/LoggedComp/Wallet/TransTable";

const Mycredit = () => {
    // Read meterNumber from Redux store if available
    const utility = useSelector((state: RootState) => state.utility);

console.log("UTILITY =", utility);
    const { meterNumber } = useSelector((state: RootState) => state.meter);
    console.log(meterNumber);

    const [refreshKey, setRefreshKey] = useState<number>(0);

    const handleTransactionSuccess = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="w-full space-y-2 p-4">
            <ConsumptionCard 
          
                onTransactionSuccess={handleTransactionSuccess} 
            />
            <TransTable 
                
                refreshKey={refreshKey} 
            />
        </div>
    );
};

export default Mycredit;