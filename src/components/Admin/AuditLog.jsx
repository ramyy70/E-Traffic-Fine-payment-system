import React from 'react';
import { useData } from '../../context/DataContext';

const AuditLog = () => {
    const { auditLog } = useData();

    return (
        <div className="table-shell">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h3 className="text-lg font-bold text-slate-900">System Audit Log</h3>
                <p className="mt-1 text-sm text-slate-500">Chronological trail of payments, complaint updates, and enforcement actions.</p>
            </div>
            <div className="table-scroll">
                <table className="data-table divide-y divide-slate-100">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Action</th>
                            <th>User</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {auditLog.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-500">
                                    No events logged yet.
                                </td>
                            </tr>
                        ) : (
                            auditLog.map((log) => (
                                <tr key={log.id}>
                                    <td className="whitespace-nowrap text-xs font-medium text-slate-500">{new Date(log.date).toLocaleString()}</td>
                                    <td className="whitespace-nowrap text-xs font-bold uppercase tracking-wide text-slate-700">{log.action}</td>
                                    <td className="whitespace-nowrap text-sm text-slate-600">{log.user}</td>
                                    <td className="text-sm text-slate-600">{log.details}</td>
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
