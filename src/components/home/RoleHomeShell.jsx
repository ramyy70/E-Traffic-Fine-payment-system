import React from 'react';
import { ArrowRight, Info, PhoneCall, Search, ShieldCheck } from 'lucide-react';
import { useLang } from '../../context/LangContext';

const Pill = ({ children }) => (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white">
        <ShieldCheck className="h-4 w-4" />
        {children}
    </div>
);

const PrimarySearch = ({ label, placeholder, value, onChange, onSubmit, cta, hint }) => (
    <form
        onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.();
        }}
        className="mt-7 w-full max-w-2xl"
        aria-label={label}
    >
        <label className="sr-only" htmlFor="primarySearch">
            {label}
        </label>

        <div className="grid gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 sm:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-2 px-2">
                <Search className="h-5 w-5 text-white/70" />
                <input
                    id="primarySearch"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none sm:text-base"
                />
            </div>
            <button type="submit" className="btn-primary rounded-xl px-5 py-2.5 text-sm sm:text-base">
                {cta}
                <ArrowRight className="h-4 w-4" />
            </button>
        </div>
        <p className="mt-2 text-xs text-white/70 sm:text-sm">
            {hint}
        </p>
    </form>
);

const ActionCard = ({ icon, title, desc, onClick, featured = false }) => {
    const Icon = icon;

    return (
        <button
            onClick={onClick}
            className={`group relative w-full overflow-hidden rounded-3xl border p-5 text-left transition ${
                featured
                    ? 'border-slate-700/70 bg-slate-900 text-white hover:bg-slate-900/95'
                    : 'border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:shadow-xl'
            }`}
        >
            <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${
                    featured ? 'border-white/20 bg-white/10' : 'border-slate-200 bg-slate-100'
                }`}
            >
                <Icon className={`h-6 w-6 ${featured ? 'text-white' : 'text-slate-700'}`} />
            </div>
            <h3 className={`mt-4 text-lg font-bold ${featured ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            <p className={`mt-2 text-sm ${featured ? 'text-white/75' : 'text-slate-600'}`}>{desc}</p>
        </button>
    );
};

const Stat = ({ value, label }) => (
    <div className="stat-card text-center">
        <div className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{value}</div>
        <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-xs">{label}</div>
    </div>
);

const Step = ({ n, title, desc }) => (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">{n}</div>
        <h4 className="mt-4 text-lg font-bold text-slate-900">{title}</h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
);

export default function RoleHomeShell({
    badge,
    titleLine1,
    titleAccent,
    subtitle,
    illustration,
    searchLabel,
    searchPlaceholder,
    searchValue,
    setSearchValue,
    searchCta,
    searchHint,
    onSearch,
    actions = [],
    stats = [],
    stepsTitle,
    stepsSubtitle,
    steps = [],
    emergencyTitle,
    emergencyDesc,
    emergencyItems = [
        { label: '', value: '119' },
        { label: '', value: '1990' },
    ],
}) {
    const { t } = useLang();
    const resolvedBadge = badge || t('officialService');
    const resolvedSearchCta = searchCta || t('check');
    const resolvedSearchHint = searchHint || t('searchByNicVehicleFine');
    const resolvedStepsTitle = stepsTitle || t('howItWorks');
    const resolvedStepsSubtitle = stepsSubtitle || t('howItWorksSub');
    const resolvedEmergencyTitle = emergencyTitle || t('emergency');
    const resolvedEmergencyDesc = emergencyDesc || t('emergencyDesc');
    const resolvedEmergencyItems = emergencyItems.map((item, idx) => {
        if (item.label) return item;
        return {
            ...item,
            label: idx === 0 ? t('police') : t('ambulance'),
        };
    });

    return (
        <div className="page-container">
            <section className="role-hero relative overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-[#0b2447] via-[#15427f] to-[#0e5f7d] px-6 pb-7 pt-7 shadow-2xl sm:px-8 sm:pb-10 sm:pt-10">
                <div className="pointer-events-none absolute inset-0">
                    <div className="animate-float-soft absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />
                    <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-blue-200/12 blur-3xl" />
                </div>

                <div className="relative grid items-start gap-8 xl:grid-cols-12">
                    <div className="xl:col-span-7">
                        <Pill>{resolvedBadge}</Pill>

                        <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] text-white sm:text-5xl xl:text-6xl">
                            {titleLine1}
                            <span className="block text-[#7be4da]">{titleAccent}</span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/82 sm:text-lg">{subtitle}</p>

                        <PrimarySearch
                            label={searchLabel}
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={setSearchValue}
                            onSubmit={onSearch}
                            cta={resolvedSearchCta}
                            hint={resolvedSearchHint}
                        />
                    </div>

                    <div className="xl:col-span-5">
                        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                            {illustration || (
                                <div className="flex h-56 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-sm font-semibold text-white/70">
                                    {t('illustrationPlaceholder')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative mt-8 grid gap-4 lg:grid-cols-3">
                    {actions.slice(0, 3).map((action, idx) => (
                        <ActionCard
                            key={action.title}
                            icon={action.icon}
                            title={action.title}
                            desc={action.desc}
                            onClick={action.onClick}
                            featured={idx === 1}
                        />
                    ))}
                </div>
            </section>

            {stats.length > 0 && (
                <section className="surface-card-strong">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <Stat key={`${stat.value}-${stat.label}`} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </section>
            )}

                <section className="surface-card">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900">{resolvedStepsTitle}</h2>
                        <p className="mt-2 text-sm text-slate-500 sm:text-base">{resolvedStepsSubtitle}</p>
                    </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    {steps.map((step, idx) => (
                        <Step key={step.title} n={idx + 1} title={step.title} desc={step.desc} />
                    ))}
                </div>

                <div className="mt-7 grid gap-4 lg:grid-cols-12">
                    <div className="surface-muted lg:col-span-8">
                        <div className="flex items-start gap-3">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                                <Info className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('helpAndSupport')}</h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    {t('helpAndSupportDesc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="surface-muted lg:col-span-4">
                        <div className="flex items-start gap-3">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                                <PhoneCall className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{resolvedEmergencyTitle}</h3>
                                <p className="mt-1 text-sm text-slate-600">{resolvedEmergencyDesc}</p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2.5">
                            {resolvedEmergencyItems.map((item) => (
                                <div
                                    key={item.value}
                                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3"
                                >
                                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                                    <span className="text-xl font-extrabold text-slate-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className="mt-8 border-t border-slate-200 pt-5 text-center text-xs font-medium text-slate-500">
                    {new Date().getFullYear()} {t('footerSecureOps')}
                </footer>
            </section>
        </div>
    );
}
