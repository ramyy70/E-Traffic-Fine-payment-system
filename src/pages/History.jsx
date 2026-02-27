import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

const History = () => {
    const { fines } = useData();
    const { user } = useAuth();
    const { t } = useLang();

    const userFines = fines.filter((fine) => fine.userId === user.id);

    return (
        <div className="page-container">
            <section className="page-header">
                <h1 className="page-title">{t('history')}</h1>
                <p className="page-subtitle">View all issued fines, payment status, and location details in one audit-ready table.</p>
            </section>

            <div className="table-shell">
                <div className="table-scroll">
                    <table className="data-table divide-y divide-slate-100">
                        <thead>
                            <tr>
                                <th>{t('fineId')}</th>
                                <th>{t('violation')}</th>
                                <th>{t('status')}</th>
                                <th>{t('amount')}</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {userFines.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-10 text-center text-sm text-slate-500">
                                        No fine history found for this account.
                                    </td>
                                </tr>
                            ) : (
                                userFines.map((fine) => (
                                    <tr key={fine.id}>
                                        <td className="whitespace-nowrap text-sm font-semibold text-slate-900">#{fine.id}</td>
                                        <td className="whitespace-nowrap">{fine.violation}</td>
                                        <td className="whitespace-nowrap">
                                            <span className={fine.status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}>
                                                {fine.status === 'Paid' ? t('statusPaid') : t('statusUnpaid')}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap text-sm font-bold text-slate-900">Rs. {Number(fine.amount).toLocaleString()}</td>
                                        <td className="text-sm text-slate-500">
                                            <div className="flex flex-col space-y-1.5">
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {fine.date}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {fine.location}
                                                </div>
                                                {fine.paidDate && (
                                                    <div className="flex items-center gap-1 text-xs text-emerald-700">
                                                        <DollarSign className="h-3.5 w-3.5" />
                                                        Paid on {fine.paidDate}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
