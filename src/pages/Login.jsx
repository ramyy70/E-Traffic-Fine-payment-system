import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CreditCard, Moon, ShieldCheck, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import govCrest from '../assets/gov-login-crest.svg';

const demoAccounts = [
    { labelKey: 'rolePolice', value: 'POL999' },
    { labelKey: 'roleDriver', value: '901234567V' },
    { labelKey: 'roleAdmin', value: 'ADM999' },
];

const Login = () => {
    const { login } = useAuth();
    const { t } = useLang();
    const { theme, toggleTheme } = useTheme();
    const [nic, setNic] = useState('');
    const [errorKey, setErrorKey] = useState('');
    const isDark = theme === 'dark';

    const handleLogin = (event) => {
        event.preventDefault();
        if (!nic.trim()) {
            setErrorKey('errEnterId');
            return;
        }

        const result = login(nic);
        if (!result.success) setErrorKey(result.messageKey || 'errInvalidId');
    };

    return (
        <div className="login-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">
            <button
                type="button"
                onClick={toggleTheme}
                className={`ring-focus absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold backdrop-blur ${
                    isDark
                        ? 'border border-white/20 bg-black/20 text-white'
                        : 'border border-slate-200 bg-white/90 text-slate-700'
                }`}
                aria-label={isDark ? t('switchToLightMode') : t('switchToDarkMode')}
                title={isDark ? t('switchToLightMode') : t('switchToDarkMode')}
            >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{isDark ? t('themeLight') : t('themeDark')}</span>
            </button>

            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl" />
                <div className="absolute -right-16 top-0 h-80 w-80 rounded-full bg-blue-400/16 blur-3xl" />
                <div className="absolute bottom-[-140px] left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-blue-900/55 blur-3xl" />
            </div>

            <div className="login-card relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur lg:grid-cols-2">
                <section className="login-info-panel hidden h-full border-r border-white/10 bg-gradient-to-br from-[#0b2447] via-[#14376d] to-[#0f6683] px-8 py-10 text-white lg:block">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-cyan-200">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-cyan-100/90">{t('govOfSriLanka')}</p>
                            <p className="truncate text-lg font-extrabold text-white">{t('appTitle')}</p>
                            <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/80">
                                {t('departmentOfMotorTraffic')}
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-4">
                        <img
                            src={govCrest}
                            alt={t('loginIllustrationAlt')}
                            className="h-72 w-full rounded-2xl border border-white/15 bg-white/5 p-2 object-contain"
                            loading="lazy"
                        />
                    </div>

                    <div className="mt-6 space-y-2 text-sm text-slate-100">
                        <p className="font-semibold">{t('loginPanelLine1')}</p>
                        <p className="text-slate-200/90">{t('loginPanelLine2')}</p>
                        <p className="text-xs font-medium text-slate-200/80">{t('loginPanelLine3')}</p>
                    </div>
                </section>

                <section className="login-form-panel px-5 py-8 sm:px-8 sm:py-10">
                    <div className="mx-auto w-full max-w-md">
                        <div className="text-center xl:text-left">
                            <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">{t('secureLogin')}</p>
                            <h1 className="mt-2 text-3xl font-bold text-white">{t('appTitle')}</h1>
                            <p className="mt-2 text-sm text-slate-300">{t('departmentOfMotorTraffic')}</p>
                        </div>

                        <form onSubmit={handleLogin} className="mt-8 space-y-5">
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                                    {t('loginIdLabel')}
                                </label>
                                <div className="relative">
                                    <CreditCard className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-300" />
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                        placeholder={t('loginPlaceholder')}
                                        value={nic}
                                        onChange={(event) => {
                                            setNic(event.target.value);
                                            setErrorKey('');
                                        }}
                                    />
                                </div>
                            </div>

                            {errorKey && (
                                <div className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-500/20 px-3 py-2 text-sm text-rose-100">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{t(errorKey)}</span>
                                </div>
                            )}

                            <button type="submit" className="btn-primary w-full py-3">
                                <ArrowRight className="h-4 w-4" />
                                {t('loginBtn')}
                            </button>
                        </form>

                        <div className="mt-7 border-t border-white/10 pt-5">
                            <p className="text-center text-xs uppercase tracking-[0.15em] text-slate-400">{t('demoCreds')}</p>
                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                {demoAccounts.map((account) => (
                                    <button
                                        key={account.value}
                                        type="button"
                                        onClick={() => {
                                            setNic(account.value);
                                            setErrorKey('');
                                        }}
                                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                            isDark
                                                ? 'border-white/15 bg-white/10 text-slate-100 hover:bg-white/15'
                                                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                                        }`}
                                    >
                                        {t(account.labelKey)}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-3 text-center text-xs text-slate-400">{t('loginDemoHint')}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;
