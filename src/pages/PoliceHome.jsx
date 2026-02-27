import React, { useState } from 'react';
import { ClipboardList, FilePlus2, ScanSearch, ShieldCheck } from 'lucide-react';
import RoleHomeShell from '../components/home/RoleHomeShell';

export default function PoliceHome({ go }) {
    const [query, setQuery] = useState('');

    return (
        <RoleHomeShell
            badge="Police Operations Portal"
            titleLine1="Officer Console"
            titleAccent="Fast, Accurate, Auditable"
            subtitle="Issue violations, verify payments, and review enforcement activity through a secure role-based workflow."
            searchLabel="Search fines and drivers"
            searchPlaceholder="Driver NIC / license number / fine reference"
            searchValue={query}
            setSearchValue={setQuery}
            searchCta="Search Records"
            onSearch={() => go('policeDashboard')}
            illustration={
                <div className="grid gap-3">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/70">Live Status</p>
                        <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                            <ShieldCheck className="h-5 w-5 text-cyan-200" />
                            Audit logging enabled for all officer actions
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/15 bg-slate-950/30 p-3 text-white/85">
                            <p className="text-xs uppercase tracking-wide text-white/60">Avg Search</p>
                            <p className="mt-1 text-lg font-bold">2.1 sec</p>
                        </div>
                        <div className="rounded-xl border border-white/15 bg-slate-950/30 p-3 text-white/85">
                            <p className="text-xs uppercase tracking-wide text-white/60">Sync Health</p>
                            <p className="mt-1 text-lg font-bold">99.9%</p>
                        </div>
                    </div>
                </div>
            }
            actions={[
                {
                    icon: FilePlus2,
                    title: 'Issue Fine',
                    desc: 'Create and submit a fine sheet in one guided form.',
                    onClick: () => go('issueFine'),
                },
                {
                    icon: ClipboardList,
                    title: 'Issued Fines',
                    desc: 'Review recently issued fines and payment updates.',
                    onClick: () => go('policeDashboard'),
                },
                {
                    icon: ScanSearch,
                    title: 'Verify Payment',
                    desc: 'Confirm receipt status during roadside checks.',
                    onClick: () => go('policeDashboard'),
                },
            ]}
            stats={[
                { value: '24/7', label: 'Officer Access' },
                { value: '99.9%', label: 'Availability' },
                { value: '2s', label: 'Average Query Time' },
                { value: '100%', label: 'Audit Coverage' },
            ]}
            stepsTitle="Officer Workflow"
            stepsSubtitle="Three steps to complete field actions safely."
            steps={[
                {
                    title: 'Find Record',
                    desc: 'Search by NIC, license, or fine reference before issuing actions.',
                },
                {
                    title: 'Issue or Verify',
                    desc: 'Create a fine sheet or validate paid status against receipt data.',
                },
                {
                    title: 'Complete Audit Trail',
                    desc: 'Every transaction is logged with timestamp and officer metadata.',
                },
            ]}
            emergencyItems={[
                { label: 'Police HQ', value: '119' },
                { label: 'Ambulance', value: '1990' },
                { label: 'Traffic Hotline', value: '011-2441111' },
            ]}
        />
    );
}
