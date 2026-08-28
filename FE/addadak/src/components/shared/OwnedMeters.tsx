import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { setMeterData } from "../../store/meterSlice";

export interface Meter {
  _id?: {
    meterNumber?: string;
    meterType?: string;
    address?: string;
  } | string;
  meterNumber?: string;
  meterType?: string;
  address?: string;
}

interface Props {
  meters: Array<Meter>;
  getUserTier: (meterNum: string) => void;
  getUserReadings: (meterNum: string) => void;
}

const OwnedMeters = ({ meters, getUserTier, getUserReadings }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { meterNumber } = useSelector((state: RootState) => state.meter);

  return (
    <div className="w-full border border-secondary-purple rounded-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
      <h1 className="text-secondary-purple text-xl sm:text-2xl font-bold text-center sm:text-left">
        Owned Meters
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
        {meters && meters.length > 0 ? (
          meters.map((ele, index) => {
            // التعامل مع هيكل البيانات سواء جاء كـ object عادي أو محتوى جوة _id
            const currentMeterNumber =
              typeof ele._id === "object" ? ele._id?.meterNumber : ele.meterNumber;
            const currentMeterType =
              typeof ele._id === "object" ? ele._id?.meterType : ele.meterType;
            const currentAddress =
              typeof ele._id === "object" ? ele._id?.address : ele.address;

            const isSelected =
              meterNumber === currentMeterNumber || (meterNumber === "" && index === 0);

            return (
              <button
                key={index}
                onClick={() => {
                  if (currentMeterNumber) {
                    dispatch(
                      setMeterData({
                        meterNumber: currentMeterNumber,
                        meterType: currentMeterType,
                      })
                    );
                    getUserTier(currentMeterNumber);
                    getUserReadings(currentMeterNumber);
                  }
                }}
                className={`rounded-2xl sm:rounded-3xl p-3 sm:p-4 border shadow-md flex flex-col justify-center items-center text-center transition-all duration-300 w-full min-h-[90px] hover:-translate-y-1 ${isSelected
                  ? "border-gas-yellow bg-secondary-purple scale-[1.02] sm:scale-105 text-gas-yellow font-bold shadow-lg"
                  : "border-gray-200 bg-secondary-purple text-gray-300 hover:border-gray-400"
                  }`}
              >
                <p className="font-bold text-sm sm:text-base w-full truncate">
                  {currentMeterType || "No type"}
                </p>
                <p className="font-medium text-xs sm:text-sm w-full truncate">
                  {currentMeterNumber || "No Number"}
                </p>
                <p className="text-xs opacity-80 w-full truncate" title={currentAddress}>
                  {currentAddress || "No address"}
                </p>
              </button>
            );
          })
        ) : (
          <p className="col-span-full text-gray-500 text-center py-6 text-sm sm:text-base">
            No Meters for this user
          </p>
        )}
      </div>
    </div>
  );
};

export default OwnedMeters;