import { useOutletContext } from "react-router-dom";
import ConsumptionCard from "../../../components/LoggedComp/Wallet/ConsumptionCard";
import TransTable from "../../../components/LoggedComp/Wallet/TransTable";

// import work from "../../../assets/construction.png"
const Mycredit = () => {

    const {meterNo}=useOutletContext<{meterNo:string}>()

    return (
        <>
            {/* <p>E-wallet Under Construction ......</p>
            <div className="w-fill flex justify-center">
                <img src={work} alt="" width={500}/>
            </div> */}

            <div className="w-full space-y-2 p-4 ">
                <ConsumptionCard  meterNumber={meterNo}/>
                <TransTable  meterNumber={meterNo}/>
            </div>




        </>
    )

}

export default Mycredit;