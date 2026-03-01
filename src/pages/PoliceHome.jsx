import React, { useState } from 'react';
import { ClipboardList, FilePlus2, ScanSearch, ShieldCheck } from 'lucide-react';
import RoleHomeShell from '../components/home/RoleHomeShell';
import { useLang } from '../context/LangContext';

export default function PoliceHome({ go }) {
    const [query, setQuery] = useState('');
    const { t } = useLang();

    return (
        <RoleHomeShell
            badge={t('policePortalBadge')}
            titleLine1={t('policeHomeHeroTitle1')}
            titleAccent={t('policeHomeHeroTitle2')}
            subtitle={t('policeHomeHeroSub')}
            searchLabel={t('policeSearchLabel')}
            searchPlaceholder={t('policeSearchPlaceholder')}
            searchValue={query}
            setSearchValue={setQuery}
            searchCta={t('searchRecords')}
            onSearch={() => go('policeDashboard')}
            illustration={
                <div className="grid gap-3">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/70">{t('liveStatus')}</p>
                        <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                            <ShieldCheck className="h-5 w-5 text-cyan-200" />
                            {t('auditLoggingEnabled')}
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/15 bg-slate-950/30 p-3 text-white/85">
                            <p className="text-xs uppercase tracking-wide text-white/60">{t('avgSearch')}</p>
                            <p className="mt-1 text-lg font-bold">2.1 sec</p>
                        </div>
                        <div className="rounded-xl border border-white/15 bg-slate-950/30 p-3 text-white/85">
                            <p className="text-xs uppercase tracking-wide text-white/60">{t('syncHealth')}</p>
                            <p className="mt-1 text-lg font-bold">99.9%</p>
                        </div>
                    </div>
                </div>
            }
            actions={[
                {
                    icon: FilePlus2,
                    title: t('policeActionIssueTitle'),
                    desc: t('policeActionIssueDesc'),
                    onClick: () => go('issueFine'),
                },
                {
                    icon: ClipboardList,
                    title: t('policeActionIssuedTitle'),
                    desc: t('policeActionIssuedDesc'),
                    onClick: () => go('policeDashboard'),
                },
                {
                    icon: ScanSearch,
                    title: t('policeActionVerifyTitle'),
                    desc: t('policeActionVerifyDesc'),
                    onClick: () => go('policeDashboard'),
                },
            ]}
            stats={[
                { value: '24/7', label: t('policeStatAccess') },
                { value: '99.9%', label: t('policeStatAvailability') },
                { value: '2s', label: t('policeStatQuery') },
                { value: '100%', label: t('policeStatAudit') },
            ]}
            stepsTitle={t('policeStepsTitle')}
            stepsSubtitle={t('policeStepsSub')}
            steps={[
                {
                    title: t('policeStep1Title'),
                    desc: t('policeStep1Desc'),
                },
                {
                    title: t('policeStep2Title'),
                    desc: t('policeStep2Desc'),
                },
                {
                    title: t('policeStep3Title'),
                    desc: t('policeStep3Desc'),
                },
            ]}
            emergencyItems={[
                { label: t('policeHq'), value: '119' },
                { label: t('ambulance'), value: '1990' },
                { label: t('trafficHotline'), value: '011-2441111' },
            ]}
        />
    );
}
