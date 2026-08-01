import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ConsumptionCard from "../../../components/LoggedComp/Wallet/ConsumptionCard";
import TransTable from "../../../components/LoggedComp/Wallet/TransTable";

const Mycredit = () => {
    const { meterNo } = useOutletContext<{ meterNo: string }>();
    const [refreshKey, setRefreshKey] = useState<number>(0);

    const handleTransactionSuccess = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="w-full space-y-2 p-4">
            <ConsumptionCard 
                meterNumber={meterNo} 
                onTransactionSuccess={handleTransactionSuccess} 
            />
            <TransTable 
                meterNumber={meterNo} 
                refreshKey={refreshKey} 
            />
        </div>
    );
};

export default Mycredit;