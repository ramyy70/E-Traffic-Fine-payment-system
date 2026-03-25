import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LangProvider } from './context/LangContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';

import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import History from './pages/History';
import Complaints from './pages/Complaints';
import PublicHome from './pages/PublicHome';
import DriverHome from './pages/DriverHome';
import PoliceHome from './pages/PoliceHome';

const homePageByRole = {
    driver: 'driverHome',
    police: 'policeHome',
    admin: 'adminDashboard',
};

const allowedPagesByRole = {
    driver: ['driverHome', 'payFines', 'history', 'complaints'],
    police: ['policeHome', 'policeDashboard', 'issueFine'],
    admin: ['adminDashboard', 'audit', 'users', 'fines'],
};

const resolvePageForRole = (role, currentPage) => {
    const allowedPages = allowedPagesByRole[role] || [];
    if (allowedPages.includes(currentPage)) return currentPage;
    return homePageByRole[role] || 'dashboard';
};

const AppContent = () => {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');

    if (!user) return <PublicHome />;

    const activePage = resolvePageForRole(user.role, currentPage);

    const renderPage = () => {
        if (user.role === 'admin') {
            if (activePage === 'audit') return <AdminDashboard view="audit" />;
            if (activePage === 'users') return <AdminDashboard view="users" />;
            if (activePage === 'fines') return <AdminDashboard view="fines" />;
            return <AdminDashboard view="queue" />;
        }

        if (user.role === 'police') {
            if (activePage === 'policeHome') return <PoliceHome go={setCurrentPage} />;
            if (activePage === 'issueFine') return <PoliceDashboard view="issue" />;
            return <PoliceDashboard view="history" />;
        }

        if (activePage === 'driverHome') return <DriverHome go={setCurrentPage} />;
        if (activePage === 'payFines') return <DriverDashboard />;
        if (activePage === 'history') return <History />;
        if (activePage === 'complaints') return <Complaints />;
        return <DriverHome go={setCurrentPage} />;
    };

    return (
        <Layout currentPage={activePage} setCurrentPage={setCurrentPage}>
            {renderPage()}
        </Layout>
    );
};

export default function App() {
    return (
        <ThemeProvider>
            <LangProvider>
                <AuthProvider>
                    <DataProvider>
                        <AppContent />
                    </DataProvider>
                </AuthProvider>
            </LangProvider>
        </ThemeProvider>
    );
}
