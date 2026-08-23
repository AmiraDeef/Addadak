import { useState, useEffect } from "react";
import { Zap, CreditCard, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import api from "../../../api/axios";
import { StripeModal } from "./StripeModal";
import { setAutoPayData } from "../../../store/meterSlice";

interface ConsumptionCardProps {
  meterNumber?: string;
  onTransactionSuccess?: () => void;
}

const ConsumptionCard = ({ onTransactionSuccess }: ConsumptionCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { nid: userNId, id: userId } = useSelector((state: RootState) => state.auth);
  const { meterNumber, meterType, autoPay, autoPayAmount } = useSelector((state: RootState) => state.meter);
  const { consumptionTable } = useSelector((state: RootState) => state.consumptions);

  const latestConsumption = consumptionTable?.[0]?.consumption
    ? Math.abs(consumptionTable[0].consumption)
    : 0;

  const [recentCharges, setRecentCharges] = useState<any[]>([]);
  const [chargeLoading, setChargeLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");

  const [localAutoPayAmount, setLocalAutoPayAmount] = useState<string>('');
  const [autoPayLoading, setAutoPayLoading] = useState<boolean>(false);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showStripeModal, setShowStripeModal] = useState<boolean>(false);

  const [latestInvoice, setLatestInvoice] = useState<any>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  useEffect(() => {
    if (autoPayAmount !== undefined && autoPayAmount !== null) {
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

      if (res.data.success) {
        dispatch(
          setAutoPayData({
            autoPay: Boolean(res.data.autoPay),
            autoPayAmount: Number(res.data.autoPayAmount) || 100,
          })
        );

        if (Array.isArray(res.data.transactions)) {
          const successful = res.data.transactions
            .filter(
              (t: any) =>
                t.status === "success" ||
                t.status === "succeeded"
            )
            .slice(0, 3);

          setRecentCharges(successful);
        }
      }
    } catch (error) {
      console.error("Failed to get wallet data:", error);
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
        dispatch(
          setAutoPayData({
            autoPay: Boolean(res.data.autoPay),
            autoPayAmount: Number(res.data.autoPayAmount) || 100,
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
    <div className="w-full bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-4 lg:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Stats */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#31123D] text-white">
              <Zap className="w-3.5 h-3.5 text-[#FACC15]" /> {meterType}
            </span>
            <span className="text-xs text-gray-500 font-mono font-semibold">
              #{meterNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white/50 p-3.5 rounded-xl border border-white/70 my-auto">
            <div className="border-r border-slate-200/60 pr-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Consumption</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-[#31123D]">
                  {latestConsumption}
                </span>
                <span className="text-xs font-bold text-gray-500">kWh</span>
              </div>
            </div>

            <div className="pl-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Charged</p>
              <p className="text-xl font-black text-emerald-600 mt-1">
                {recentCharges.length > 0 ? `${recentCharges[0].amount} EGP` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-7 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-200/40 pt-4 lg:pt-0 lg:pl-5">
          {meterType === "Bill" ? (
            <div className="p-3.5 rounded-xl bg-white/50 border border-white/70 shadow-sm flex flex-col justify-center gap-3 h-full my-auto">
              {dueDate && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/40">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#31123D]" /> Next Due Date
                  </span>
                  <span className="text-xs font-bold text-[#31123D] bg-[#31123D]/10 px-2.5 py-0.5 rounded-md">
                    {dueDate}
                  </span>
                </div>
              )}

              {latestInvoice?.status === "success" || latestInvoice?.status === "succeeded" ? (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">Bill Settled</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Paid
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleCharge}
                  disabled={chargeLoading}
                  className="w-full py-2.5 px-4 bg-[#31123D] hover:bg-[#431854] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>{chargeLoading ? "Processing..." : "Pay Current Bill"}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#FACC15]" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Full Width Professional Charge Row */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#31123D]" />
                  Enter Amount to Charge (Min 25 EGP)
                </label>

                <div className="flex items-center gap-2 w-full">
                  <input
                    type="number"
                    min="25"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 100"
                    className={`flex-1 h-10 px-3.5 text-xs bg-white/70 border rounded-xl focus:outline-none text-slate-800 font-semibold transition-all ${
                      amount && Number(amount) < 25
                        ? "border-red-400 focus:border-red-500"
                        : "border-white/80 focus:border-[#31123D]"
                    }`}
                  />
                  
                  <button
                    onClick={handleCharge}
                    disabled={chargeLoading || !amount || Number(amount) < 25}
                    className="h-10 px-6 bg-[#31123D] hover:bg-[#431854] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>{chargeLoading ? "..." : "Charge"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#FACC15]" />
                  </button>
                </div>

                {amount && Number(amount) < 25 && (
                  <p className="text-[10px] text-red-500 font-medium">
                    Min amount is 25 EGP
                  </p>
                )}
              </div>

              {/* Full Width Auto Pay Box */}
              <div className="p-3 rounded-xl bg-white/50 border border-white/70 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#31123D]" />
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
                    <div className="w-7 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {autoPay && (
                  <div className="mt-2 pt-2 border-t border-slate-200/40 flex items-center justify-between gap-2">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">
                      Fixed Amount:
                    </label>
                    <input
                      type="number"
                      min="25"
                      value={localAutoPayAmount}
                      onChange={(e) => setLocalAutoPayAmount(e.target.value)}
                      onBlur={() => handleToggleAutoPay(true)}
                      placeholder="100"
                      className="w-24 px-2 py-1 text-xs bg-white/80 border border-slate-200 rounded-lg focus:outline-none focus:border-[#31123D] text-slate-800 font-semibold text-right"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
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
              className="w-full py-2.5 bg-[#31123D] text-white text-xs font-bold rounded-xl hover:opacity-90 shadow-sm transition-all"
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