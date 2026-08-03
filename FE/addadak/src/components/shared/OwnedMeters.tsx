import { useState ,useEffect} from "react";
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { utilityHandler } from "../../store/utilitySlice"

interface props {
    meters: Array<object>,
    getUserTier: Function,
    getUserReadings: Function
}


const OwnedMeters = ({ meters, getUserTier, getUserReadings }: props) => {
    const [meterNo, setMeterNo] = useState("");
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
    if (meters.length > 0) {

        const firstMeter = meters[0]._id;

        setMeterNo(firstMeter.meterNumber);

        dispatch(
            utilityHandler({
                utility: "electricity",
                meterNumber: firstMeter.meterNumber,
                meterType: firstMeter.meterType,
            })
        );
    }
}, [meters, dispatch]);
    return (
        <div className="border border-secondary-purple rounded-2xl px-4 py-3 flex flex-col gap-6">
            <h1 className="text-secondary-purple text-2xl " > Owned Meters</h1>
            <div className="grid grid-cols-2 md:grid-cols-4  gap-6  w-fill max-w-7xl  ">

                {meters && meters.length > 0 ?
                    (
                        meters.map((ele, index) => {
                            const currentMeterNumber = ele._id.meterNumber;
                            const currentMeterType = ele._id.meterType;
                            const currentAddress = ele._id.address;
                            const currentUtility = ele._id.utility


                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (currentMeterNumber) {
                                            setMeterNo(currentMeterNumber);
                                            dispatch(
                                                utilityHandler({
                                                    utility: currentUtility,
                                                    meterNumber: currentMeterNumber,
                                                    meterType: currentMeterType

                                                })
                                            )
                                            getUserTier(currentMeterNumber);
                                            getUserReadings(currentMeterNumber);
                                        }
                                    }}
                                    className={`rounded-3xl py-4 px-12 border shadow-md flex flex-col justify-center items-center text-center transition-all duration-300 w-full h-24 hover:-translate-y-1 ${(meterNo === currentMeterNumber || index === 0)
                                            ? "border-gas-yellow bg-secondary-purple transition-all duration-300 scale-112 text-gas-yellow font-bold "
                                            : "border-gray-200 bg-secondary-purple text-gray-300"
                                        }`}
                                    >

                                    <p className="font-bold text-base">{currentMeterType || " No type"}</p>
                                    <p className="0 font-medium">{currentMeterNumber || "No Number"}</p>
                                    <p className="text-sm ">{currentAddress || "No address"}</p>
                              </button>
                            );
                        })
                    ) : (<p className="text-gray-500 text-center">No Meters for this user  </p>)}

            </div>
        </div>
    )
}

export default OwnedMeters;