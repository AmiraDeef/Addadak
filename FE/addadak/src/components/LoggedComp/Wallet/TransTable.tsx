import { History } from "lucide-react";

const TransTable = ({ meterNumber }: { meterNumber?: string }) => {
    return (
        <div className="w-full bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-6 ">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-[var(--color-secondary-purple)]" />
                    <h3 className="text-base font-bold text-gray-800">Transaction History</h3>
                </div>
                <span className="text-xs font-medium text-gray-400">Sorted by most recent</span>
            </div>

            <div className="overflow-x-auto">
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
                        {[
                            { id: "tx_99812", date: "2026-07-20", type: "Smart Meter", amount: "114 EGP", status: "succeeded" },
                            { id: "tx_88123", date: "2026-06-18", type: "Smart Meter", amount: "98 EGP", status: "succeeded" },
                            { id: "tx_77210", date: "2026-05-15", type: "Smart Meter", amount: "85 EGP", status: "failed" }
                        ].map((tx, idx) => (
                            <tr key={idx} className="hover:bg-white/60 transition-colors">
                                <td className="py-4 px-4 font-mono text-xs font-semibold text-gray-500">{tx.id}</td>
                                <td className="py-4 px-4 text-xs font-semibold text-gray-600">{tx.date}</td>
                                <td className="py-4 px-4 text-xs font-bold text-gray-800">{tx.type}</td>
                                <td className="py-4 px-4 text-sm font-bold text-[var(--color-secondary-purple)]">{tx.amount}</td>
                                <td className="py-4 px-4 text-center">
                                    <span
                                        className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                                            tx.status === "succeeded"
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransTable;