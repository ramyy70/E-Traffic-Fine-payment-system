import React from 'react';
import { useLang } from '../context/LangContext';
import ComplaintForm from '../components/Driver/ComplaintForm';
import ComplaintList from '../components/Driver/ComplaintList';

const Complaints = () => {
    const { t } = useLang();

    return (
        <div className="page-container">
            <section className="page-header">
                <h1 className="page-title">{t('complaints')}</h1>
                <p className="page-subtitle">Submit appeal requests with evidence and monitor each complaint lifecycle status.</p>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <ComplaintForm />
                </div>
                <div className="lg:col-span-2">
                    <ComplaintList />
                </div>
            </div>
        </div>
    );
};

export default Complaints;
