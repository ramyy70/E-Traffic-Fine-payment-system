import React from 'react';
import {
    ClipboardList,
    CreditCard,
    FilePlus,
    FileText,
    History,
    Home,
    LayoutDashboard,
    LogOut,
    ShieldAlert,
    X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';

const roleLabelKeys = {
    driver: 'roleDriver',
    police: 'rolePolice',
    admin: 'roleAdmin',
};

const Sidebar = ({ setCurrentPage, currentPage, mobileOpen, onCloseMobile }) => {
    const { user, logout } = useAuth();
    const { t } = useLang();

    const driverLinks = [
        { name: 'driverHome', icon: Home, label: t('dashboard') },
        { name: 'payFines', icon: CreditCard, label: t('driverTilePay') },
        { name: 'history', icon: History, label: t('history') },
        { name: 'complaints', icon: FileText, label: t('complaints') },
    ];

    const adminLinks = [
        { name: 'adminDashboard', icon: LayoutDashboard, label: t('adminDashboard') },
        { name: 'audit', icon: ClipboardList, label: t('auditLog') },
    ];

    const policeLinks = [
        { name: 'policeHome', icon: Home, label: t('policeHomeTitle') },
        { name: 'policeDashboard', icon: ShieldAlert, label: t('policeTileHistory') },
        { name: 'issueFine', icon: FilePlus, label: t('policeTileIssue') },
    ];

    const links =
        user?.role === 'admin' ? adminLinks : user?.role === 'police' ? policeLinks : driverLinks;

    const goRoleHome = () => {
        if (user?.role === 'driver') setCurrentPage('driverHome');
        else if (user?.role === 'police') setCurrentPage('policeHome');
        else if (user?.role === 'admin') setCurrentPage('adminDashboard');
        else setCurrentPage('dashboard');
        onCloseMobile?.();
    };

    const navigateTo = (name) => {
        setCurrentPage(name);
        onCloseMobile?.();
    };

    return (
        <>
            <button
                onClick={onCloseMobile}
                className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden ${
                    mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                }`}
                aria-hidden={!mobileOpen}
                tabIndex={mobileOpen ? 0 : -1}
            />

            <aside
                className={`sidebar-panel fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-slate-700/40 shadow-2xl transition-transform duration-300 lg:static lg:z-20 lg:translate-x-0 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-slate-800/80 bg-gradient-to-r from-[#0b2447] via-[#14376d] to-[#0e2d59] px-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gradient-brand">E-Traffic</h1>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300/70">{t('operations')}</p>
                    </div>
                    <button
                        onClick={onCloseMobile}
                        className="ring-focus inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-300 lg:hidden"
                        aria-label={t('closeNavigation')}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-5">
                    <button
                        type="button"
                        onClick={goRoleHome}
                        className="ring-focus flex w-full items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-3 text-left hover:bg-slate-900"
                        aria-label={t('goRoleHome')}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 text-sm font-bold text-white">
                            {(user?.name || 'U').charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{user?.name || t('user')}</p>
                            <p className="truncate text-xs uppercase tracking-wide text-slate-400">
                                {t(roleLabelKeys[user?.role] || user?.role || 'roleGuest')}
                            </p>
                        </div>
                    </button>

                    <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
                        {links.map((link) => {
                            const isActive = currentPage === link.name;
                            return (
                                <button
                                    key={link.name}
                                    onClick={() => navigateTo(link.name)}
                                    className={`ring-focus group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                                    }`}
                                >
                                    <link.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                    <span className="truncate">{link.label}</span>
                                    {isActive && <span className="absolute right-2 h-2 w-2 rounded-full bg-cyan-200" />}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="border-t border-slate-800 pt-4">
                        <button onClick={logout} className="btn-danger w-full">
                            <LogOut className="h-4 w-4" />
                            {t('logout')}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
