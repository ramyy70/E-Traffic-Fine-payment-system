import React from 'react';
import { Check, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

const ComplaintsQueue = () => {
    const { complaints, updateComplaintStatus } = useData();
    const { t } = useLang();
    const pendingComplaints = complaints.filter((complaint) => complaint.status === 'Pending');

    return (
        <div className="surface-card p-0">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h3 className="text-lg font-bold text-slate-900">{t('complaintsQueue')}</h3>
                <span className="badge-pill bg-amber-100 text-amber-700">
                    {pendingComplaints.length} {t('pending')}
                </span>
            </div>

            {pendingComplaints.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">{t('noPendingComplaints')}</div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {pendingComplaints.map((complaint) => (
                        <div key={complaint.id} className="p-6 transition hover:bg-slate-50">
                            <div className="flex flex-col justify-between gap-4 xl:flex-row">
                                <div className="max-w-2xl space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900">
                                            {t('fineLabel')} #{complaint.fineId}
                                        </span>
                                        <span className="text-xs text-slate-500">{complaint.submittedDate}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {t('reason')}: {complaint.reason}
                                    </p>
                                    <p className="text-sm text-slate-600">{complaint.description}</p>
                                    <button type="button" className="text-xs font-semibold text-blue-700 underline">
                                        {t('viewAttachmentDemo')}
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 xl:justify-end">
                                    <button
                                        onClick={() => updateComplaintStatus(complaint.id, 'Resolved')}
                                        className="btn-soft border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    >
                                        <Check className="h-4 w-4" />
                                        {t('approve')}
                                    </button>
                                    <button
                                        onClick={() => updateComplaintStatus(complaint.id, 'Rejected')}
                                        className="btn-soft border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                    >
                                        <X className="h-4 w-4" />
                                        {t('reject')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ComplaintsQueue;
