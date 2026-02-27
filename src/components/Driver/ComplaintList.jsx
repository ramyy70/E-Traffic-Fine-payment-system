import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const ComplaintList = () => {
    const { complaints } = useData();
    const { t } = useLang();

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Rejected': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusClass = (status) => {
        if (status === 'Resolved') return 'badge-paid';
        if (status === 'Rejected') return 'badge-unpaid';
        return 'badge-pill bg-amber-100 text-amber-700';
    };

    return (
        <div className="surface-card h-full p-0">
            <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-lg font-bold text-slate-900">{t('myComplaints')}</h3>
                <p className="mt-1 text-sm text-slate-500">Track progress and final decisions on each submitted complaint.</p>
            </div>
            <div className="divide-y divide-slate-100">
                {complaints.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">No complaints submitted yet.</div>
                ) : (
                    complaints.map((complaint) => (
                        <div key={complaint.id} className="p-5 transition hover:bg-slate-50">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <div>
                                    <span className="text-sm font-bold text-slate-900">Fine #{complaint.fineId}</span>
                                    <p className="mt-1 text-xs text-slate-500">Submitted on {complaint.submittedDate}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(complaint.status)}
                                    <span className={getStatusClass(complaint.status)}>
                                        {complaint.status === 'Resolved' ? t('resolved') : complaint.status}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm font-semibold text-slate-700">{complaint.reason}</p>
                            <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                                {complaint.description || 'No additional description provided.'}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ComplaintList;
