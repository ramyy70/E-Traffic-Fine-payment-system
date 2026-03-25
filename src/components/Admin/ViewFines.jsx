import React, { useState, useEffect } from 'react';
import { adminHelpers } from '../../lib/supabase';
import { Loader, Receipt, AlertCircle } from 'lucide-react';

const ViewFines = () => {
    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFines = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminHelpers.getAllFines();
            setFines(data || []);
        } catch (err) {
            setError(err.message || 'Error fetching fines');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFines();
    }, []);

    if (loading && fines.length === 0) {
        return (
            <div className="flex justify-center flex-col items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-cyan-500 mb-4" />
                <p className="text-sm text-slate-500">Loading fine records...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#0b2447]">All Fines</h3>
                <button 
                    onClick={fetchFines} 
                    className="text-sm text-cyan-500 font-semibold hover:text-cyan-600"
                >
                    Refresh List
                </button>
            </div>
            
            {error && (
                <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Fine Number</th>
                            <th className="px-6 py-4 font-semibold">Driver</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Amount (LKR)</th>
                            <th className="px-6 py-4 font-semibold text-right">Date Issued</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {fines.map((f) => (
                            <tr key={f.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Receipt className="h-4 w-4 text-slate-400" />
                                        <span className="font-semibold text-slate-900">{f.fine_number}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-800">{f.driver?.user?.full_name || 'Unknown Driver'}</span>
                                        <span className="text-xs text-slate-500">NIC: {f.driver?.nic_number || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        f.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                        f.status === 'waived' ? 'bg-slate-100 text-slate-700' :
                                        'bg-rose-100 text-rose-700'
                                    }`}>
                                        {f.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {Number(f.fine_amount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 text-right text-slate-500">
                                    {new Date(f.issued_date).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {fines.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                    No fines found in the system.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewFines;
