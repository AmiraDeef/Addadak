import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { setMeterData } from "../../store/meterSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to dynamically enable/disable arrows
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [meters]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full border border-secondary-purple rounded-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-secondary-purple text-xl sm:text-2xl font-bold">
          Owned Meters
        </h1>

        {/* Navigation Arrows */}
        {meters && meters.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className="p-1.5 sm:p-2 rounded-full border border-secondary-purple text-secondary-purple hover:bg-secondary-purple hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary-purple disabled:cursor-not-allowed transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className="p-1.5 sm:p-2 rounded-full border border-secondary-purple text-secondary-purple hover:bg-secondary-purple hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary-purple disabled:cursor-not-allowed transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-3 sm:gap-4 lg:gap-6 w-full overflow-x-auto scrollbar-none scroll-smooth py-2 px-1"
      >
        {meters && meters.length > 0 ? (
          meters.map((ele, index) => {
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
                className={`flex-shrink-0 w-[200px] sm:w-[240px] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border shadow-md flex flex-col justify-center items-center text-center transition-all duration-300 min-h-[90px] hover:-translate-y-1 ${
                  isSelected
                    ? "border-gas-yellow bg-secondary-purple scale-[1.02] text-gas-yellow font-bold shadow-lg"
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
          <p className="w-full text-gray-500 text-center py-6 text-sm sm:text-base">
            No Meters for this user
          </p>
        )}
      </div>
    </div>
  );
};

export default OwnedMeters;