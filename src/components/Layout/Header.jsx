import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe, Menu, Moon, Sun } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Notifications from './Notifications';

const pageTitleKeys = {
    driverHome: 'driverHomeTitle',
    policeHome: 'policeHomeTitle',
    payFines: 'driverTilePay',
    history: 'history',
    complaints: 'complaints',
    policeDashboard: 'policeTileHistory',
    issueFine: 'policeTileIssue',
    adminDashboard: 'adminDashboard',
    audit: 'auditLog',
};

const languageLabelKeys = {
    en: 'langEnglish',
    si: 'langSinhala',
    ta: 'langTamil',
};

const roleLabelKeys = {
    driver: 'roleDriver',
    police: 'rolePolice',
    admin: 'roleAdmin',
};

const Header = ({ toggleSidebar, currentPage }) => {
    const { t, lang, switchLang } = useLang();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const langRef = useRef(null);

    useEffect(() => {
        const onOutsideClick = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setLangMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', onOutsideClick);
        return () => document.removeEventListener('mousedown', onOutsideClick);
    }, []);

    const currentLabel = t(pageTitleKeys[currentPage] || 'dashboard');
    const isDark = theme === 'dark';

    return (
        <header
            className="sticky top-0 z-30 border-b border-slate-200/90 px-4 py-3 backdrop-blur-xl sm:px-6"
            style={{ backgroundColor: 'var(--header-bg)' }}
        >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        className="ring-focus inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                        onClick={toggleSidebar}
                        aria-label={t('openNavigation')}
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-900 sm:text-lg">{t('appTitle')}</p>
                        <p className="truncate text-xs font-medium text-slate-500">{currentLabel}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="ring-focus inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                        aria-label={isDark ? t('switchToLightMode') : t('switchToDarkMode')}
                        title={isDark ? t('switchToLightMode') : t('switchToDarkMode')}
                    >
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>

                    <Notifications />

                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setLangMenuOpen((prev) => !prev)}
                            className="ring-focus inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                            aria-expanded={langMenuOpen}
                            aria-haspopup="menu"
                        >
                            <Globe className="h-4 w-4 text-slate-500" />
                            <span className="uppercase">{lang}</span>
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {langMenuOpen && (
                            <div className="animate-rise absolute right-0 z-40 mt-2 w-36 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                                {['en', 'si', 'ta'].map((language) => (
                                    <button
                                        key={language}
                                        onClick={() => {
                                            switchLang(language);
                                            setLangMenuOpen(false);
                                        }}
                                        className={`block w-full px-4 py-2.5 text-left text-sm ${
                                            lang === language
                                                ? 'bg-blue-50 font-semibold text-blue-700'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {t(languageLabelKeys[language])}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {user && (
                        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 md:flex">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                                {user.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-slate-800">{user.name}</p>
                                <p className="truncate text-[11px] uppercase tracking-wide text-slate-500">
                                    {t(roleLabelKeys[user.role] || user.role)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
