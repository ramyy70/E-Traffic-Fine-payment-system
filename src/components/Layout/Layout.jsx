import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, currentPage, setCurrentPage }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setMobileMenuOpen(false);
    const openMobileMenu = () => setMobileMenuOpen(true);

    return (
        <div className="app-shell-bg flex min-h-screen overflow-hidden">
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                mobileOpen={mobileMenuOpen}
                onCloseMobile={closeMobileMenu}
            />

            <div className="relative flex min-w-0 flex-1 flex-col">
                <Header
                    toggleSidebar={openMobileMenu}
                    currentPage={currentPage}
                />
                <main className="flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-10 lg:pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
