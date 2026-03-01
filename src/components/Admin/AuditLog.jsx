import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

const actionKeyByType = {
    FINE_ISSUED: 'auditActionFineIssued',
    PAYMENT: 'auditActionPayment',
    COMPLAINT_SUBMIT: 'auditActionComplaintSubmit',
    COMPLAINT_UPDATE: 'auditActionComplaintUpdate',
};

const AuditLog = () => {
    const { auditLog } = useData();
    const { t } = useLang();
    const renderDetails = (log) => {
        if (!log.detailsKey) return log.details;
        const translated = t(log.detailsKey, log.detailsParams || {});
        if (translated === log.detailsKey && log.details) return log.details;
        return translated;
    };

    return (
        <div className="table-shell">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h3 className="text-lg font-bold text-slate-900">{t('systemAuditLog')}</h3>
                <p className="mt-1 text-sm text-slate-500">{t('systemAuditLogSub')}</p>
            </div>
            <div className="table-scroll">
                <table className="data-table divide-y divide-slate-100">
                    <thead>
                        <tr>
                            <th>{t('timestamp')}</th>
                            <th>{t('action')}</th>
                            <th>{t('user')}</th>
                            <th>{t('details')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {auditLog.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-500">
                                    {t('noAuditEvents')}
                                </td>
                            </tr>
                        ) : (
                            auditLog.map((log) => (
                                <tr key={log.id}>
                                    <td className="whitespace-nowrap text-xs font-medium text-slate-500">{new Date(log.date).toLocaleString()}</td>
                                    <td className="whitespace-nowrap text-xs font-bold uppercase tracking-wide text-slate-700">
                                        {t(actionKeyByType[log.action] || log.action)}
                                    </td>
                                    <td className="whitespace-nowrap text-sm text-slate-600">{log.user}</td>
                                    <td className="text-sm text-slate-600">{renderDetails(log)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLog;
