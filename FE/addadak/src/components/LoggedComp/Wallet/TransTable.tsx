import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { History, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../../api/axios";

interface Transaction {
    _id: string;
    payingDate: string;
    meterType?: string;
    amount: number;
    status: string;
}

interface TransTableProps {
    meterNumber?: string;
    refreshKey?: number | string;
}

const TransTable = ({ refreshKey }: TransTableProps) => {
     const { meterNumber: reduxMeterNumber } = useSelector((state: RootState) => state.utility);
    const meterNumber = reduxMeterNumber;
    console.log(meterNumber);
    const [trans, setTrans] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const fetchTrans = useCallback(async () => {
        if (!meterNumber) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.walletApi.get(`/getwallet/${meterNumber}`, { withCredentials: true });
            setTrans(res.data.transactions || res.data);
            setCurrentPage(1);
        } catch (err) {
            setError("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [meterNumber]);

    useEffect(() => {
        fetchTrans();
    }, [fetchTrans, refreshKey]);

    const totalPages = Math.ceil(trans.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = trans.slice(startIndex, endIndex);

    return (
        <div className="w-full bg-white/40 rounded-2xl border border-white/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-[var(--color-secondary-purple)]" />
                    <h3 className="text-base font-bold text-gray-800">Transaction History</h3>
                </div>
                <span className="text-xs font-medium text-gray-400">Sorted by most recent</span>
            </div>

            <div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-300/40 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <th className="py-3 px-4">Transaction ID</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Meter Type</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-[var(--color-secondary-purple)]" />
                                        <span>Loading transactions...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-rose-500 text-xs font-semibold">
                                    {error}
                                </td>
                            </tr>
                        ) : trans.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-400 text-xs font-semibold">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            currentTransactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-white/60 transition-colors">
                                    <td className="py-4 px-4 font-mono text-xs font-semibold text-gray-500">
                                        {tx._id.slice(-6)} 
                                    </td>
                                    <td className="py-4 px-4 text-xs font-semibold text-gray-600">
                                        {new Date(tx.payingDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4 text-xs font-bold text-gray-800">
                                        {tx.meterType || "Smart Meter"}
                                    </td>
                                    <td className="py-4 px-4 text-sm font-bold text-[var(--color-secondary-purple)]">
                                        {tx.amount} EGP
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span
                                            className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                                                tx.status === "succeeded" || tx.status === "success"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : tx.status === "pending"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-rose-100 text-rose-700"
                                            }`}
                                        >
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!loading && trans.length > 0 && (
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200/40 text-xs font-semibold text-gray-500">
                    <span>
                        Showing {startIndex + 1} to {Math.min(endIndex, trans.length)} of {trans.length} transactions
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white/60 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>

                        <span className="px-3 py-1 bg-[var(--color-secondary-purple)] text-white font-bold rounded-lg">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white/60 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransTable;