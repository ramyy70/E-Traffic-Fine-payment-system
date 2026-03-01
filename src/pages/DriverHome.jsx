import React, { useState } from 'react';
import { CreditCard, FileText, ShieldCheck, WalletCards } from 'lucide-react';
import RoleHomeShell from '../components/home/RoleHomeShell';
import { useLang } from '../context/LangContext';

export default function DriverHome({ go }) {
    const [query, setQuery] = useState('');
    const { t } = useLang();

    return (
        <RoleHomeShell
            badge={t('driverPortalBadge')}
            titleLine1={t('driverHomeHeroTitle1')}
            titleAccent={t('driverHomeHeroTitle2')}
            subtitle={t('driverHomeHeroSub')}
            searchLabel={t('driverSearchLabel')}
            searchPlaceholder={t('driverSearchPlaceholder')}
            searchValue={query}
            setSearchValue={setQuery}
            searchCta={t('findFine')}
            onSearch={() => go('payFines')}
            illustration={
                <div className="grid gap-3">
                    <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-4 text-white">
                        <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/70">{t('currentBalance')}</p>
                            <p className="mt-1 text-2xl font-extrabold">Rs. 3,000</p>
                        </div>
                        <WalletCards className="h-9 w-9 text-cyan-200" />
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-slate-950/30 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/70">{t('security')}</p>
                        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
                            <ShieldCheck className="h-5 w-5 text-cyan-200" />
                            {t('encryptedTransactions')}
                        </div>
                    </div>
                </div>
            }
            actions={[
                {
                    icon: CreditCard,
                    title: t('driverActionPayTitle'),
                    desc: t('driverActionPayDesc'),
                    onClick: () => go('payFines'),
                },
                {
                    icon: FileText,
                    title: t('driverActionDisputesTitle'),
                    desc: t('driverActionDisputesDesc'),
                    onClick: () => go('complaints'),
                },
            ]}
            stats={[
                { value: '1.2M+', label: t('driverStatProcessed') },
                { value: '500K+', label: t('driverStatRegistered') },
                { value: '24/7', label: t('driverStatAvailability') },
                { value: '100%', label: t('driverStatTraceability') },
            ]}
            stepsTitle={t('driverStepsTitle')}
            stepsSubtitle={t('driverStepsSub')}
            steps={[
                {
                    title: t('driverStep1Title'),
                    desc: t('driverStep1Desc'),
                },
                {
                    title: t('driverStep2Title'),
                    desc: t('driverStep2Desc'),
                },
                {
                    title: t('driverStep3Title'),
                    desc: t('driverStep3Desc'),
                },
            ]}
            emergencyItems={[
                { label: t('police'), value: '119' },
                { label: t('ambulance'), value: '1990' },
                { label: t('fire'), value: '110' },
            ]}
        />
    );
}
