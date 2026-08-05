import { useState, useEffect } from "react";
import { Zap, Brain, CreditCard, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import api from "../../../api/axios";
import { StripeModal } from "./StripeModal";

interface ConsumptionCardProps {
    meterNumber?: string;
    onTransactionSuccess?: () => void;
}

const ConsumptionCard = ({ onTransactionSuccess }: ConsumptionCardProps) => {

    const { nid: userNId, id: userId } = useSelector((state: RootState) => state.auth);
    const { meterNumber: reduxMeterNumber } = useSelector((state: RootState) => state.utility);
    const { meterType } = useSelector((state: RootState) => state.utility);
    const meterNumber = reduxMeterNumber;
    console.log(meterNumber);


    const { consumptionTable } = useSelector((state: RootState) => state.consumptions);

    const latestConsumption = consumptionTable?.[0]?.consumption
        ? Math.abs(consumptionTable[0].consumption)
        : 0;

    const [recentCharges, setRecentCharges] = useState<any[]>([]);
    const [chargeLoading, setChargeLoading] = useState<boolean>(false);

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [showStripeModal, setShowStripeModal] = useState<boolean>(false);

    const [latestInvoice, setLatestInvoice] = useState<any>(null);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);


    const getWalletHistory = async () => {
        if (!meterNumber) return;
        try {
            const res = await api.walletApi.get(
                `/getWallet/${meterNumber}`,
                { withCredentials: true }
            );
            console.log(res.data);

            if (res.data.success && Array.isArray(res.data.transactions)) {
                const successful = res.data.transactions
                    .filter((t: any) => t.status === "success" || t.status === "succeeded")
                    .slice(0, 3);
                setRecentCharges(successful);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getLastInvoice = async () => {
        if (!userNId || !meterNumber) return;
        const res = await api.walletApi.get(
            `/getPaymentDetails/${userNId}/${meterNumber}`,
            { withCredentials: true }
        );
        if (res.data.success) {
            setLatestInvoice(res.data.transaction);
        }
    };

    const handleCharge = async () => {
        if (!userNId || !meterNumber) return;
        try {
            setChargeLoading(true);
            const res = await api.walletApi.post(
                `chargeMeters/${userNId}/${meterNumber}`,
                {},
                { withCredentials: true }
            );
            if (res.data.clientSecret) {
                setClientSecret(res.data.clientSecret);
                setShowStripeModal(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setChargeLoading(false);
        }
    };

    const handlePaymentSuccess = async () => {
        setShowStripeModal(false);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await Promise.all([
            getWalletHistory(),
            getLastInvoice()
        ]);
        setShowSuccessModal(true);
    };

    const handleModalClose = async () => {
        setShowStripeModal(false);
        await getWalletHistory();
        onTransactionSuccess?.();
    };

    const handleDone = async () => {
        setShowSuccessModal(false);
        await getWalletHistory();
        onTransactionSuccess?.();
    };

    useEffect(() => {
        getWalletHistory();
    }, [meterNumber, userNId, userId]);

    return (
        <div className="w-full bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-5 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                <div className="flex flex-col justify-between space-y-4 md:border-r border-gray-300/40 md:pr-6">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-secondary-purple)] text-white">
                                <Zap className="w-3.5 h-3.5 text-[var(--color-gas-yellow)]" /> {meterType}
                            </span>
                            <span className="text-xs text-gray-500 font-mono tracking-wider">
                                {meterNumber}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4 bg-white/60 p-3 rounded-xl border border-white/80">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Month Consumption</p>
                                <div className="flex items-baseline gap-1.5 mt-1">
                                    <span className="text-3xl font-extrabold text-[var(--color-secondary-purple)] tracking-tight">
                                        {latestConsumption}
                                    </span>
                                    <span className="text-sm font-bold text-gray-500">kWh</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Amount Charged</p>
                                <p className="text-2xl font-bold text-emerald-600 m-2">
                                    {recentCharges.length > 0 ? `${recentCharges[0].amount} EGP` : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-1">

                        {meterType === "Smart Meter" && (<div className="flex items-center justify-between bg-white/60 p-2.5 rounded-xl border border-white/80">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-[var(--color-secondary-purple)]" />
                                <span className="text-xs font-bold text-gray-700">AutoPay</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-secondary-purple)]"></div>
                            </label>

                        </div>
                        )}


                        <button
                            onClick={handleCharge}
                            disabled={chargeLoading}
                            className="w-full py-2.5 px-4 bg-[var(--color-secondary-purple)] hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                            <span>
                                {
                                    chargeLoading
                                        ? "Processing..."
                                        : meterType === "Bill"
                                            ? "Pay Bill"
                                            : "Charge Meter"
                                }
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-[var(--color-gas-yellow)]" />
                        </button>
                    </div>
                </div>

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
                            {recentCharges.length > 0 ? (
                                recentCharges.map((item, idx) => (
                                    <div
                                        key={item._id || idx}
                                        className="flex justify-between items-center text-xs p-2 px-3 rounded-lg bg-white/50 border border-white/70 hover:bg-white/80 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-600">
                                            {new Date(item.payingDate || item.createdAt).toLocaleDateString('en-GB', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                        <span className="font-bold text-[var(--color-secondary-purple)]">
                                            {Math.round(item.amount)} EGP
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-gray-400 italic p-2 text-center">
                                    No recent charges found
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {showStripeModal && clientSecret && (
                <StripeModal
                    clientSecret={clientSecret}
                    onClose={handleModalClose}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {showSuccessModal && latestInvoice && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800">Payment Successful!</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Meter: {latestInvoice.meterNumber}</p>

                        <div className="my-4 p-3.5 bg-gray-50 rounded-xl text-left space-y-2 text-xs border border-gray-100">
                            <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                                <span className="text-gray-500">Amount Paid:</span>
                                <span className="font-bold text-emerald-600">{latestInvoice.amount} EGP</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                                <span className="text-gray-500">Meter Type:</span>
                                <span className="font-semibold text-gray-700">{latestInvoice.meterType}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                                <span className="text-gray-500">Address:</span>
                                <span className="font-semibold text-gray-700 truncate max-w-[150px]">{latestInvoice.address || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <span className="font-bold text-emerald-600 uppercase">{latestInvoice.status}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleDone}
                            className="w-full py-2.5 bg-[var(--color-secondary-purple)] text-white text-xs font-bold rounded-xl hover:opacity-90 shadow-sm transition-all"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsumptionCard;