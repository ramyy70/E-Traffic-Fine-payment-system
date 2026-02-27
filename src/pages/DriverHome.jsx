import React, { useState } from 'react';
import { CreditCard, FileText, Headphones, ShieldCheck, WalletCards } from 'lucide-react';
import RoleHomeShell from '../components/home/RoleHomeShell';

export default function DriverHome({ go }) {
    const [query, setQuery] = useState('');

    return (
        <RoleHomeShell
            badge="Driver Digital Portal"
            titleLine1="Traffic Fines"
            titleAccent="Handled In Minutes"
            subtitle="Check violations, complete payments, and track disputes from one secure dashboard built for fast everyday use."
            searchLabel="Search fines"
            searchPlaceholder="Vehicle number / NIC / Fine reference (e.g., WP CAA-1234)"
            searchValue={query}
            setSearchValue={setQuery}
            searchCta="Find Fine"
            onSearch={() => go('payFines')}
            illustration={
                <div className="grid gap-3">
                    <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-4 text-white">
                        <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/70">Current Balance</p>
                            <p className="mt-1 text-2xl font-extrabold">Rs. 3,000</p>
                        </div>
                        <WalletCards className="h-9 w-9 text-cyan-200" />
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-slate-950/30 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/70">Security</p>
                        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
                            <ShieldCheck className="h-5 w-5 text-cyan-200" />
                            Encrypted transactions and verified receipts
                        </div>
                    </div>
                </div>
            }
            actions={[
                {
                    icon: CreditCard,
                    title: 'Pay Fines',
                    desc: 'Clear unpaid fines with secure card or QR payment.',
                    onClick: () => go('payFines'),
                },
                {
                    icon: FileText,
                    title: 'Disputes',
                    desc: 'Submit appeals and track responses from administrators.',
                    onClick: () => go('complaints'),
                },
                {
                    icon: Headphones,
                    title: 'Help Center',
                    desc: 'Get support details and emergency contact access.',
                    onClick: () => go('complaints'),
                },
            ]}
            stats={[
                { value: '1.2M+', label: 'Fines Processed' },
                { value: '500K+', label: 'Registered Drivers' },
                { value: '24/7', label: 'Service Availability' },
                { value: '100%', label: 'Receipt Traceability' },
            ]}
            stepsTitle="How Driver Flow Works"
            stepsSubtitle="Use this three-step sequence for fast compliance."
            steps={[
                {
                    title: 'Search',
                    desc: 'Use NIC, vehicle number, or fine reference to pull exact records.',
                },
                {
                    title: 'Review and Pay',
                    desc: 'Confirm violation details and pay through supported channels.',
                },
                {
                    title: 'Store Receipt',
                    desc: 'Get instant confirmation and preserve proof for future checks.',
                },
            ]}
            emergencyItems={[
                { label: 'Police', value: '119' },
                { label: 'Ambulance', value: '1990' },
                { label: 'Fire', value: '110' },
            ]}
        />
    );
}
