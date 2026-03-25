import React from 'react';
import { useLang } from '../context/LangContext';
import ComplaintsQueue from '../components/Admin/ComplaintsQueue';
import AuditLog from '../components/Admin/AuditLog';
import ManageUsers from '../components/Admin/ManageUsers';
import ViewFines from '../components/Admin/ViewFines';

const AdminDashboard = ({ view }) => {
    const { t } = useLang();

    const getTitle = () => {
        if (view === 'audit') return t('auditLog') || 'Audit Log';
        if (view === 'users') return 'Manage Users';
        if (view === 'fines') return 'View Fines';
        return t('adminDashboard') || 'Admin Dashboard';
    };

    const renderView = () => {
        if (view === 'audit') return <AuditLog />;
        if (view === 'users') return <ManageUsers />;
        if (view === 'fines') return <ViewFines />;
        return <ComplaintsQueue />;
    };

    return (
        <div className="page-container">
            <section className="page-header">
                <h1 className="page-title">{getTitle()}</h1>
                <p className="page-subtitle">
                    {t('adminDashboardSub') || 'Manage all system activities'}
                </p>
            </section>

            {renderView()}
        </div>
    );
};

export default AdminDashboard;
