import React from 'react';
import { useLang } from '../context/LangContext';
import ComplaintsQueue from '../components/Admin/ComplaintsQueue';
import AuditLog from '../components/Admin/AuditLog';

const AdminDashboard = ({ view }) => {
    const { t } = useLang();

    return (
        <div className="page-container">
            <section className="page-header">
                <h1 className="page-title">{view === 'audit' ? t('auditLog') : t('adminDashboard')}</h1>
                <p className="page-subtitle">
                    Review complaint queues, apply final decisions, and keep the full event trail ready for compliance checks.
                </p>
            </section>

            {view === 'audit' ? <AuditLog /> : <ComplaintsQueue />}
        </div>
    );
};

export default AdminDashboard;
