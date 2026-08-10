import { useState, useEffect } from "react";
import { Zap, Brain, CreditCard, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState,AppDispatch  } from "../../../store/store";
import api from "../../../api/axios";
import { StripeModal } from "./StripeModal";
import { setAutoPayData } from "../../../store/meterSlice";

interface ConsumptionCardProps {
    meterNumber?: string;
    onTransactionSuccess?: () => void;
}

const ConsumptionCard = ({ onTransactionSuccess }: ConsumptionCardProps) => {
    const dispatch = useDispatch<AppDispatch>();

    // 2. Extract Auth and Meter states directly from Redux
    const { nid: userNId, id: userId } = useSelector((state: RootState) => state.auth);
    const { meterNumber, meterType, autoPay, autoPayAmount } = useSelector((state: RootState) => state.meter);
    const { consumptionTable } = useSelector((state: RootState) => state.consumptions);

    const latestConsumption = consumptionTable?.[0]?.consumption
        ? Math.abs(consumptionTable[0].consumption)
        : 0;

    // Component Local States
    const [recentCharges, setRecentCharges] = useState<any[]>([]);
    const [chargeLoading, setChargeLoading] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>("");

    // AutoPay Local Input State (for handling text field changes before sync)
    const [localAutoPayAmount, setLocalAutoPayAmount] = useState<string>("100");
    const [autoPayLoading, setAutoPayLoading] = useState<boolean>(false);

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [showStripeModal, setShowStripeModal] = useState<boolean>(false);

    const [latestInvoice, setLatestInvoice] = useState<any>(null);
    const [dueDate, setDueDate] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    // Keep input field synced with Redux store value when store updates
    useEffect(() => {
        if (autoPayAmount) {
            setLocalAutoPayAmount(String(autoPayAmount));
        }
    }, [autoPayAmount]);


    const calculateDueDate = (payingDate: string | Date) => {
        const date = new Date(payingDate);
        date.setDate(date.getDate() + 30);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getWalletHistory = async () => {
        if (!meterNumber) return;
        try {
            const res = await api.walletApi.get(
                `/getwallet/${meterNumber}`,
                { withCredentials: true }
            );

            if (res.data.success && Array.isArray(res.data.transactions)) {
                const successful = res.data.transactions
                    .filter((t: any) => t.status === "success" || t.status === "succeeded")
                    .slice(0, 3);
                setRecentCharges(successful);
            }
        } catch (error) {
            console.error("Failed to get wallet history:", error);
        }
    };

    const getLastInvoice = async () => {
        if (!userNId || !meterNumber) return;
        try {
            const res = await api.walletApi.get(
                `/getPaymentDetails/${userNId}/${meterNumber}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                setLatestInvoice(res.data.transaction);
                if (res.data.dueDate) {
                    setDueDate(res.data.dueDate);
                } else if (recentCharges.length > 0 && recentCharges[0].payingDate) {
                    setDueDate(calculateDueDate(recentCharges[0].payingDate));
                }
            }
        } catch (error) {
            console.error("Failed to get last invoice:", error);
        }
    };

    // 4. Toggle/Update AutoPay handling (Backend API call + Redux Sync)
    const handleToggleAutoPay = async (enabled: boolean) => {
        if (!meterNumber || !userNId) return;
        const parsedAmount = Number(localAutoPayAmount) || 100;

        try {
            setAutoPayLoading(true);
            const res = await api.walletApi.patch(
                `/enableAutopay/${userNId}/${meterNumber}`,
                {
                    autoPay: enabled,
                    amount: parsedAmount,
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                // Update Redux state immediately on backend success
                dispatch(
                    setAutoPayData({
                        autoPay: enabled,
                        autoPayAmount: enabled ? parsedAmount : 0,
                    })
                );
            }
        } catch (error) {
            console.error("AutoPay toggle error:", error);
        } finally {
            setAutoPayLoading(false);
        }
    };

    const handleCharge = async () => {
        if (!userNId || !meterNumber) return;

        if (meterType === "Smart Meter" && (!amount || Number(amount) < 25)) {
            alert("Please enter a valid amount to charge (greater than 25 EGP).");
            return;
        }

        try {
            setChargeLoading(true);
            const res = await api.walletApi.post(
                `chargeMeters/${userNId}/${meterNumber}`,
                { amount: Number(amount) },
                { withCredentials: true }
            );
            if (res.data.clientSecret) {
                setClientSecret(res.data.clientSecret);
                setShowStripeModal(true);
            }
        } catch (error) {
            console.error("Charge error:", error);
        } finally {
            setChargeLoading(false);
        }
    };

    const handlePaymentSuccess = async () => {
        setShowStripeModal(false);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await Promise.all([getWalletHistory(), getLastInvoice()]);
        setShowSuccessModal(true);
    };

    const handleModalClose = async () => {
        setShowStripeModal(false);
        await getWalletHistory();
        onTransactionSuccess?.();
    };

    const handleDone = async () => {
        setShowSuccessModal(false);
        setAmount("");
        await getWalletHistory();
        onTransactionSuccess?.();
    };

    // 5. Lifecycle hook to synchronize database records into Redux on mount or meter switch
    useEffect(() => {
        getWalletHistory();
        getLastInvoice();
   
    }, [meterNumber, userNId, userId]);

    useEffect(() => {
        if (recentCharges.length > 0 && recentCharges[0].payingDate) {
            setDueDate(calculateDueDate(recentCharges[0].payingDate));
        }
    }, [recentCharges]);

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
                        {meterType === "Bill" ? (
                            <div className="p-3.5 rounded-xl bg-white/70 border border-[var(--color-secondary-purple)]/20 shadow-sm flex flex-col gap-2.5">
                                {dueDate && (
                                    <div className="flex items-center justify-between pb-2 border-b border-[var(--color-secondary-purple)]/10">
                                        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-[var(--color-secondary-purple)]" /> Next Due Date
                                        </span>
                                        <span className="text-xs font-bold text-[var(--color-secondary-purple)] bg-[var(--color-secondary-purple)]/10 px-2.5 py-0.5 rounded-md border border-[var(--color-secondary-purple)]/20">
                                            {dueDate}
                                        </span>
                                    </div>
                                )}

                                {latestInvoice?.status === "success" || latestInvoice?.status === "succeeded" ? (
                                    <div className="flex items-center justify-between pt-0.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Bill Settled</p>
                                                <p className="text-[10px] text-slate-500 font-medium">Paid for this month</p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                                            Paid
                                        </span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleCharge}
                                        disabled={chargeLoading}
                                        className="w-full mt-1 py-2.5 px-4 bg-[var(--color-secondary-purple)] hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                                    >
                                        <span>{chargeLoading ? "Processing..." : "Pay Current Bill"}</span>
                                        <ArrowUpRight className="w-4 h-4 text-[var(--color-gas-yellow)]" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <CreditCard className="w-4 h-4 text-[var(--color-secondary-purple)]" />
                                        Enter Amount to Charge (Min 25 EGP)
                                    </label>
                                    <input
                                        type="number"
                                        min="25"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="e.g. 100"
                                        className={`w-full px-3 py-2 text-xs bg-white/80 border rounded-xl focus:outline-none text-slate-800 font-semibold transition-colors ${
                                            amount && Number(amount) < 25
                                                ? "border-red-400 focus:border-red-500"
                                                : "border-slate-200 focus:border-[var(--color-secondary-purple)]"
                                        }`}
                                    />
                                    {amount && Number(amount) < 25 && (
                                        <p className="text-[10px] text-red-500 font-medium mt-1">
                                            Amount must be at least 25 EGP
                                        </p>
                                    )}
                                </div>

                                {/* AutoPay Control Panel linked directly to Redux State */}
                                <div className="p-3 rounded-xl bg-white/70 border border-slate-200/80 shadow-sm space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                            <Zap className="w-3.5 h-3.5 text-[var(--color-secondary-purple)]" />
                                            Enable Auto Pay
                                        </span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(autoPay)}
                                                disabled={autoPayLoading}
                                                onChange={(e) => handleToggleAutoPay(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>

                                    {autoPay && (
                                        <div className="pt-2 border-t border-slate-200/60">
                                            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                                                Fixed Auto-Pay Amount (Min 25 EGP)
                                            </label>
                                            <input
                                                type="number"
                                                min="25"
                                                value={localAutoPayAmount}
                                                onChange={(e) => setLocalAutoPayAmount(e.target.value)}
                                                onBlur={() => handleToggleAutoPay(true)}
                                                placeholder="e.g. 100"
                                                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-secondary-purple)] text-slate-800 font-semibold"
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleCharge}
                                    disabled={chargeLoading || !amount || Number(amount) < 25}
                                    className="w-full py-2.5 px-4 bg-[var(--color-secondary-purple)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                                >
                                    <span>{chargeLoading ? "Processing..." : "Charge Meter"}</span>
                                    <ArrowUpRight className="w-4 h-4 text-[var(--color-gas-yellow)]" />
                                </button>
                            </div>
                        )}
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
                                            {new Date(item.payingDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
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