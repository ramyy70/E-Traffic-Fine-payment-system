import React from 'react';
import FinesList from '../components/Driver/FinesList';

const DriverDashboard = () => {
    return (
        <div className="page-container">
            <section className="page-header">
                <h1 className="page-title">Payments Dashboard</h1>
                <p className="page-subtitle">
                    Review outstanding violations, settle payments, and keep records up to date.
                </p>
            </section>

            <div className="surface-card">
                <h2 className="section-title">Unpaid Fines</h2>
                <p className="section-subtitle">Pay pending fines securely and generate a confirmation receipt instantly.</p>

                <div className="mt-5">
                    <FinesList />
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
