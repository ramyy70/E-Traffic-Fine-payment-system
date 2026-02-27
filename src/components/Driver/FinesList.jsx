import React, { useState } from 'react';
import { AlertCircle, Calendar, CheckCircle2, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import PaymentModal from './PaymentModal';

const FinesList = () => {
    const { fines } = useData();
    const { user } = useAuth();
    const { t } = useLang();

    const [selectedFine, setSelectedFine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const driverNic = user?.role === 'driver' ? (user.nic || '').trim().toUpperCase() : '';
    const userFines = fines.filter((fine) => {
        if (!user) return false;
        if (fine.userId === user.id) return true;
        // Fallback matching for "official NIC-based" linkage (helps older/localStorage data too)
        if (driverNic && (fine.offenderNic || '').trim().toUpperCase() === driverNic) return true;
        if (driverNic && fine.userId === `driver-${driverNic}`) return true;
        return false;
    });
    const unpaidFines = userFines.filter((fine) => fine.status === 'Unpaid');
    const totalUnpaidAmount = unpaidFines.reduce((sum, fine) => sum + Number(fine.amount || 0), 0);

    const handlePayClick = (fine) => {
        setSelectedFine(fine);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-3 md:grid-cols-3">
                <div className="stat-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pending Fines</p>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900">{unpaidFines.length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Total Due</p>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900">Rs. {totalUnpaidAmount.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Account Status</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                        {unpaidFines.length > 0 ? 'Action Required' : 'No Pending Violations'}
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                            <AlertCircle className="h-4 w-4" />
                        </span>
                        Pending Violations
                    </h2>
                    <span className="badge-unpaid">
                        {unpaidFines.length} {t('statusUnpaid')}
                    </span>
                </div>

                {unpaidFines.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <p className="mt-4 text-base font-semibold text-slate-800">No pending fines</p>
                        <p className="mt-1 text-sm text-slate-500">You are fully up to date. Keep driving safely.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                        {unpaidFines.map((fine) => (
                            <article key={fine.id} className="action-tile">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Fine #{fine.id}</p>
                                    <span className="text-lg font-extrabold text-slate-900">Rs. {Number(fine.amount).toLocaleString()}</span>
                                </div>

                                <h3 className="mt-3 text-base font-bold text-slate-900">{fine.violation}</h3>

                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                    <p className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span>
                                            {fine.date}
                                            {fine.time && ` • ${fine.time}`}
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        <span className="truncate">{fine.location}</span>
                                    </p>
                                    <div className="surface-muted py-2 space-y-1">
                                        <div className="flex items-center justify-between text-xs text-slate-600">
                                            <span className="font-medium uppercase tracking-wide text-slate-500">NIC</span>
                                            <span className="font-semibold">
                                                {fine.offenderNic ? `${fine.offenderNic.slice(0, 5)}*****` : 'Not captured'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Vehicle</p>
                                            <p className="text-sm font-semibold text-slate-700">{fine.vehicleNo || 'Not specified'}</p>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-600">
                                            <span className="font-medium uppercase tracking-wide text-slate-500">Reference</span>
                                            <span className="font-semibold">{fine.id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-slate-200 pt-4">
                                    <button onClick={() => handlePayClick(fine)} className="btn-primary w-full">
                                        Pay my fine
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fine={selectedFine}
            />
        </div>
    );
};

export default FinesList;
