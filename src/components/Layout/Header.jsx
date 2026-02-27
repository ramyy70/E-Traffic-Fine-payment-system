import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe, Menu } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import Notifications from './Notifications';

const pageTitles = {
    driverHome: 'Driver Home',
    policeHome: 'Police Home',
    payFines: 'Pay Fines',
    history: 'Fine History',
    complaints: 'Complaints',
    policeDashboard: 'Issued Fines',
    issueFine: 'Issue Fine',
    adminDashboard: 'Complaints Queue',
    audit: 'Audit Log',
};

const Header = ({ toggleSidebar, currentPage }) => {
    const { t, lang, switchLang } = useLang();
    const { user } = useAuth();
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

    const currentLabel = pageTitles[currentPage] || t('dashboard');

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        className="ring-focus inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                        onClick={toggleSidebar}
                        aria-label="Open navigation menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-900 sm:text-lg">{t('appTitle')}</p>
                        <p className="truncate text-xs font-medium text-slate-500">{currentLabel}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
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
                                        {language === 'en' ? 'English' : language === 'si' ? 'Sinhala' : 'Tamil'}
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
                                <p className="truncate text-[11px] uppercase tracking-wide text-slate-500">{user.role}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
