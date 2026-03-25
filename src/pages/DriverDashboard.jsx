import React from 'react';
import FinesList from '../components/Driver/FinesList';
import { useLang } from '../context/LangContext';

const DriverDashboard = () => {
    const { t } = useLang();

    return (
        <div className="page-container">
            <section className="page-header">
                <h1 className="page-title">{t('paymentsDashboardTitle')}</h1>
                <p className="page-subtitle">
                    {t('paymentsDashboardSub')}
                </p>
            </section>

            <div className="surface-card">
                <h2 className="section-title">{t('unpaidFinesTitle')}</h2>
                <p className="section-subtitle">{t('unpaidFinesSub')}</p>

                <div className="mt-5">
                    <FinesList />
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
