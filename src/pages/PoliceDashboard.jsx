import React from 'react';
import { Clock3, MapPin, ReceiptText } from 'lucide-react';
import { useData } from '../context/DataContext';
import IssueFineForm from '../components/Admin/IssueFineForm';

const PoliceDashboard = ({ view }) => {
    const { fines } = useData();
    const recentFines = [...fines].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 6);

    return (
        <div className="page-container">
            <section className="page-header">
                <h1 className="page-title">Traffic Control Unit</h1>
                <p className="page-subtitle">Manage enforcement records, issue violation sheets, and verify field-side payment status.</p>
            </section>

            {view === 'issue' ? (
                <IssueFineForm />
            ) : (
                <>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="stat-card">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Total Fines</p>
                            <p className="mt-2 text-3xl font-extrabold text-slate-900">{fines.length}</p>
                        </div>
                        <div className="stat-card">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pending</p>
                            <p className="mt-2 text-3xl font-extrabold text-slate-900">{fines.filter((fine) => fine.status === 'Unpaid').length}</p>
                        </div>
                        <div className="stat-card">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Paid</p>
                            <p className="mt-2 text-3xl font-extrabold text-slate-900">{fines.filter((fine) => fine.status === 'Paid').length}</p>
                        </div>
                    </div>

                    <div className="surface-card p-0">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">Recent Issued Fines</h2>
                            <p className="mt-1 text-sm text-slate-500">Monitor latest fine activity and payment outcomes.</p>
                        </div>

                        {recentFines.length === 0 ? (
                            <div className="px-6 py-12 text-center text-sm text-slate-500">No fines available.</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentFines.map((fine) => (
                                    <div key={fine.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-900">
                                                #{fine.id} - {fine.violation}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock3 className="h-3.5 w-3.5" />
                                                    {fine.date}
                                                    {fine.time && ` • ${fine.time}`}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {fine.location}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <ReceiptText className="h-3.5 w-3.5" />
                                                    {fine.vehicleNo || 'Vehicle not set'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-extrabold text-slate-900">Rs. {Number(fine.amount).toLocaleString()}</span>
                                            <span className={fine.status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}>{fine.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PoliceDashboard;
