import React, { useMemo, useState } from 'react';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    CreditCard,
    FileText,
    Moon,
    ShieldCheck,
    Sun,
    User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { stationDirectory } from '../data/stationDirectory';
import { isValidSriLankanNic, normalizeNic } from '../utils/identity';

const heroImageUrl =
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1800&q=80';

const roleTabs = [
    { id: 'police', label: 'Police' },
    { id: 'driver', label: 'Driver' },
    { id: 'admin', label: 'Admin' },
];

const sectionLinks = [
    { href: '#about', label: 'About' },
    { href: '#how', label: 'How to Use' },
    { href: '#benefits', label: 'Benefits' },
    { href: '#access', label: 'Access Portal' },
];

const initialSignupForm = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    driver: {
        nicNumber: '',
        licenseNumber: '',
        licenseExpiryDate: '',
        dateOfBirth: '',
        address: '',
        city: '',
        postalCode: '',
    },
    police: {
        badgeNumber: '',
        rank: '',
        department: '',
        stationId: '',
        identificationNumber: '',
    },
    admin: {
        adminCode: '',
        department: '',
        roleLevel: 'manager',
        stationId: '',
        stationVerificationCode: '',
    },
};

export default function PublicHome() {
    const { signin, signup } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [authMode, setAuthMode] = useState('signin');
    const [signupRole, setSignupRole] = useState('police');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCodes, setShowCodes] = useState(false);

    const [signinForm, setSigninForm] = useState({
        email: '',
        password: '',
        role: 'driver',
    });

    const [signupForm, setSignupForm] = useState(initialSignupForm);

    const stations = useMemo(
        () =>
            [...stationDirectory].sort((a, b) =>
                a.station_name.localeCompare(b.station_name)
            ),
        []
    );

    const clearFeedback = () => {
        setError('');
        setSuccess('');
    };

    const openAuth = (mode) => {
        setAuthMode(mode);
        clearFeedback();
        const section = document.getElementById('access');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const setRoleField = (roleKey, field, value) => {
        setSignupForm((prev) => ({
            ...prev,
            [roleKey]: {
                ...prev[roleKey],
                [field]: value,
            },
        }));
    };

    const validateSignup = () => {
        if (!signupForm.fullName.trim()) return 'Full name is required.';
        if (!signupForm.email.trim()) return 'Email is required.';
        if (signupForm.password.length < 8) return 'Password must be at least 8 characters.';
        if (signupForm.password !== signupForm.confirmPassword) return 'Passwords do not match.';

        if (signupRole === 'driver') {
            if (!isValidSriLankanNic(normalizeNic(signupForm.driver.nicNumber))) {
                return 'Please enter a valid NIC for driver registration.';
            }
            if (!signupForm.driver.licenseNumber.trim()) return 'License number is required.';
            if (!signupForm.driver.licenseExpiryDate) return 'License expiry date is required.';
        }

        if (signupRole === 'police') {
            if (!signupForm.police.badgeNumber.trim()) return 'Badge number is required.';
            if (!signupForm.police.rank.trim()) return 'Rank is required.';
            if (!signupForm.police.stationId) return 'Police station is required.';
        }

        if (signupRole === 'admin') {
            if (!signupForm.admin.adminCode.trim()) return 'Admin code is required.';
            if (!signupForm.admin.stationId) return 'Managing station is required.';
            if (!signupForm.admin.stationVerificationCode.trim()) {
                return 'Station verification code is required for admin role.';
            }
        }

        return '';
    };

    const handleSignIn = async (event) => {
        event.preventDefault();
        clearFeedback();
        setLoading(true);

        const result = await signin(signinForm.email, signinForm.password, signinForm.role);
        if (!result.success) {
            setError(result.error || 'Sign in failed.');
            setLoading(false);
            return;
        }

        setSuccess('Sign in successful. Redirecting...');
        setLoading(false);
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        clearFeedback();

        const validationError = validateSignup();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        const payload = {
            user: {
                user_type: signupRole,
                full_name: signupForm.fullName.trim(),
                email: signupForm.email.trim(),
                password: signupForm.password,
                phone_number: signupForm.phoneNumber.trim(),
            },
            driver:
                signupRole === 'driver'
                    ? {
                          nic_number: normalizeNic(signupForm.driver.nicNumber),
                          license_number: signupForm.driver.licenseNumber.trim(),
                          license_expiry_date: signupForm.driver.licenseExpiryDate,
                          date_of_birth: signupForm.driver.dateOfBirth || null,
                          address: signupForm.driver.address.trim(),
                          city: signupForm.driver.city.trim(),
                          postal_code: signupForm.driver.postalCode.trim(),
                      }
                    : undefined,
            police:
                signupRole === 'police'
                    ? {
                          badge_number: signupForm.police.badgeNumber.trim(),
                          rank: signupForm.police.rank,
                          department: signupForm.police.department.trim(),
                          station_id: signupForm.police.stationId,
                          identification_number: signupForm.police.identificationNumber.trim(),
                      }
                    : undefined,
            admin:
                signupRole === 'admin'
                    ? {
                          admin_code: signupForm.admin.adminCode.trim(),
                          department: signupForm.admin.department.trim(),
                          role_level: signupForm.admin.roleLevel,
                          station_id: signupForm.admin.stationId,
                          station_verification_code: signupForm.admin.stationVerificationCode.trim(),
                      }
                    : undefined,
        };

        const result = await signup(payload);
        if (!result.success) {
            setError(result.error || 'Sign up failed.');
            setLoading(false);
            return;
        }

        setSuccess('Account created successfully. Redirecting to your dashboard...');
        setSignupForm(initialSignupForm);
        setLoading(false);
    };

    const isDark = theme === 'dark';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0b2447]">E-Traffic SaaS</p>
                        <p className="text-xs font-medium text-slate-500">Traffic Management Platform</p>
                    </div>

                    <nav className="hidden items-center gap-5 md:flex">
                        {sectionLinks.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-sm font-semibold text-slate-600 transition hover:text-[#0b2447]"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>

                        <button
                            type="button"
                            onClick={() => openAuth('signin')}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => openAuth('signup')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2447] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#14376d]"
                        >
                            Sign Up
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            <main>
                <section className="relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `linear-gradient(120deg, rgba(11,36,71,0.9), rgba(16,84,112,0.75)), url('${heroImageUrl}')`,
                        }}
                        aria-hidden="true"
                    />
                    <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-20">
                        <div className="lg:col-span-7">
                            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
                                <ShieldCheck className="h-4 w-4" />
                                Secure Public-Sector SaaS
                            </p>
                            <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                                Unified Traffic Fines, Complaints, and Enforcement Operations
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">
                                A role-based platform built for Drivers, Police Officers, and Admin teams with secure onboarding,
                                audit-ready workflows, and station-linked governance.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => openAuth('signup')}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0b2447] transition hover:bg-slate-100"
                                >
                                    Start Free Trial
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                                <a
                                    href="#how"
                                    className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                                >
                                    See Workflow
                                </a>
                            </div>
                        </div>

                        <div className="space-y-3 lg:col-span-5">
                            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Platform Snapshot</p>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-white/20 bg-slate-950/30 p-4">
                                        <p className="text-xs text-slate-300">Multi-Role Access</p>
                                        <p className="mt-1 text-2xl font-extrabold text-white">3</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/20 bg-slate-950/30 p-4">
                                        <p className="text-xs text-slate-300">Core Modules</p>
                                        <p className="mt-1 text-2xl font-extrabold text-white">12+</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/20 bg-slate-950/30 p-4">
                                        <p className="text-xs text-slate-300">Station Verification</p>
                                        <p className="mt-1 text-2xl font-extrabold text-white">Enabled</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/20 bg-slate-950/30 p-4">
                                        <p className="text-xs text-slate-300">Audit-Ready</p>
                                        <p className="mt-1 text-2xl font-extrabold text-white">Yes</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 text-sm text-slate-100 backdrop-blur">
                                Built around your schema: users, drivers, police_officers, admin_users, traffic_fines,
                                fine_payments, fine_appeals, notifications, and audit_logs.
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
                    <div className="mb-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">About</p>
                        <h2 className="mt-2 text-3xl font-black text-[#0b2447] sm:text-4xl">
                            Built for Government-Grade Traffic Operations
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                <User className="h-5 w-5" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Role-Based Account Model</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Dedicated onboarding for Drivers, Police Officers, and Admin teams aligned with your role tables.
                            </p>
                        </article>

                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                <FileText className="h-5 w-5" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Structured Case Lifecycle</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Manage complaints, issue fines, collect payments, and track appeals in one continuous workflow.
                            </p>
                        </article>

                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Compliance and Audit Visibility</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Operation logs, notifications, and reporting views support transparent administration at scale.
                            </p>
                        </article>
                    </div>
                </section>

                <section id="how" className="border-y border-slate-200 bg-white/70">
                    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
                        <div className="mb-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">How to Use</p>
                            <h2 className="mt-2 text-3xl font-black text-[#0b2447] sm:text-4xl">Three-Step Operational Flow</h2>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Step 1</p>
                                <h3 className="mt-2 text-lg font-bold text-slate-900">Register by Role</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Sign up as Driver, Police, or Admin with schema-based profile fields for each role.
                                </p>
                            </article>

                            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Step 2</p>
                                <h3 className="mt-2 text-lg font-bold text-slate-900">Verify Station Access</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Admin users must register under a valid police station and provide a station-issued verification code.
                                </p>
                            </article>

                            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Step 3</p>
                                <h3 className="mt-2 text-lg font-bold text-slate-900">Run Daily Operations</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Officers issue and manage violations while drivers pay and track fines and admins review governance data.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section id="benefits" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
                    <div className="mb-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Benefits</p>
                        <h2 className="mt-2 text-3xl font-black text-[#0b2447] sm:text-4xl">Why This SaaS Model Works</h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <CreditCard className="h-5 w-5 text-[#0b2447]" />
                            <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.1em] text-slate-500">Faster Collections</h3>
                            <p className="mt-2 text-sm text-slate-700">Digital payment workflow reduces delay and manual follow-up.</p>
                        </article>
                        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <ShieldCheck className="h-5 w-5 text-[#0b2447]" />
                            <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.1em] text-slate-500">Secure Access</h3>
                            <p className="mt-2 text-sm text-slate-700">Role checks, station verification, and controlled admin onboarding.</p>
                        </article>
                        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <CheckCircle2 className="h-5 w-5 text-[#0b2447]" />
                            <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.1em] text-slate-500">Operational Clarity</h3>
                            <p className="mt-2 text-sm text-slate-700">Single source of truth for fines, complaints, and appeals.</p>
                        </article>
                        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <ArrowRight className="h-5 w-5 text-[#0b2447]" />
                            <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.1em] text-slate-500">Scalable SaaS</h3>
                            <p className="mt-2 text-sm text-slate-700">Supports multi-station growth without changing core workflows.</p>
                        </article>
                    </div>
                </section>

                <section id="access" className="bg-slate-900 py-14">
                    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <h2 className="text-3xl font-black text-white sm:text-4xl">Access Portal</h2>
                            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                                Use your role credentials to sign in. New users can create accounts with schema-aligned fields. Admin
                                accounts are station-gated and require a station verification code.
                            </p>

                            <div className="mt-6 space-y-3">
                                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">Demo Credentials</p>
                                    <p className="mt-1 text-sm text-slate-200">Tip: Use unique emails per signup to avoid rate limits.</p>
                                    <p className="mt-1 text-sm text-slate-200">Driver: driver.demo{Math.floor(Math.random() * 1000)}@etraffic.lk / Driver@123</p>
                                    <p className="mt-1 text-sm text-slate-200">Police: police.demo{Math.floor(Math.random() * 1000)}@etraffic.lk / Police@123</p>
                                    <p className="mt-1 text-sm text-slate-200">Admin: admin.demo{Math.floor(Math.random() * 1000)}@etraffic.lk / Admin@123</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="rounded-3xl border border-white/15 bg-white p-6 shadow-2xl sm:p-8">
                                <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthMode('signin');
                                            clearFeedback();
                                        }}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                            authMode === 'signin' ? 'bg-[#0b2447] text-white' : 'text-slate-600 hover:bg-white'
                                        }`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthMode('signup');
                                            clearFeedback();
                                        }}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                            authMode === 'signup' ? 'bg-[#0b2447] text-white' : 'text-slate-600 hover:bg-white'
                                        }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                {error && (
                                    <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{success}</span>
                                    </div>
                                )}

                                {authMode === 'signin' ? (
                                    <form onSubmit={handleSignIn} className="space-y-4">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Role</label>
                                            <select
                                                value={signinForm.role}
                                                onChange={(event) => setSigninForm((prev) => ({ ...prev, role: event.target.value }))}
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                            >
                                                {roleTabs.map((role) => (
                                                    <option key={role.id} value={role.id}>{role.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                                            <input
                                                type="email"
                                                value={signinForm.email}
                                                onChange={(event) => setSigninForm((prev) => ({ ...prev, email: event.target.value }))}
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
                                            <input
                                                type="password"
                                                value={signinForm.password}
                                                onChange={(event) => setSigninForm((prev) => ({ ...prev, password: event.target.value }))}
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2447] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14376d] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {loading ? 'Signing in...' : 'Sign In'}
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleSignUp} className="space-y-4">
                                        <div className="grid gap-2 rounded-xl bg-slate-100 p-1 sm:grid-cols-3">
                                            {roleTabs.map((role) => (
                                                <button
                                                    key={role.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSignupRole(role.id);
                                                        clearFeedback();
                                                    }}
                                                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                                        signupRole === role.id ? 'bg-[#0b2447] text-white' : 'text-slate-600 hover:bg-white'
                                                    }`}
                                                >
                                                    {role.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <input
                                                type="text"
                                                value={signupForm.fullName}
                                                onChange={(event) => setSignupForm((prev) => ({ ...prev, fullName: event.target.value }))}
                                                placeholder="Full name"
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                            />
                                            <input
                                                type="tel"
                                                value={signupForm.phoneNumber}
                                                onChange={(event) => setSignupForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                                                placeholder="Phone number"
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                            />
                                            <input
                                                type="email"
                                                value={signupForm.email}
                                                onChange={(event) => setSignupForm((prev) => ({ ...prev, email: event.target.value }))}
                                                placeholder="Email"
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                            />
                                            <input
                                                type="password"
                                                value={signupForm.password}
                                                onChange={(event) => setSignupForm((prev) => ({ ...prev, password: event.target.value }))}
                                                placeholder="Password"
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                            />
                                        </div>

                                        <input
                                            type="password"
                                            value={signupForm.confirmPassword}
                                            onChange={(event) => setSignupForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                                            placeholder="Confirm password"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                        />

                                        {signupRole === 'driver' && (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <input
                                                    type="text"
                                                    value={signupForm.driver.nicNumber}
                                                    onChange={(event) => setRoleField('driver', 'nicNumber', event.target.value)}
                                                    placeholder="NIC Number"
                                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                                />
                                                <input
                                                    type="text"
                                                    value={signupForm.driver.licenseNumber}
                                                    onChange={(event) => setRoleField('driver', 'licenseNumber', event.target.value)}
                                                    placeholder="License Number"
                                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                                />
                                                <input
                                                    type="date"
                                                    value={signupForm.driver.licenseExpiryDate}
                                                    onChange={(event) => setRoleField('driver', 'licenseExpiryDate', event.target.value)}
                                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                                />
                                            </div>
                                        )}

                                        {signupRole === 'police' && (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <input
                                                    type="text"
                                                    value={signupForm.police.badgeNumber}
                                                    onChange={(event) => setRoleField('police', 'badgeNumber', event.target.value)}
                                                    placeholder="Badge Number"
                                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                                />
                                                <input
                                                    type="text"
                                                    value={signupForm.police.rank}
                                                    onChange={(event) => setRoleField('police', 'rank', event.target.value)}
                                                    placeholder="Rank"
                                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                                />
                                                <select
                                                    value={signupForm.police.stationId}
                                                    onChange={(event) => setRoleField('police', 'stationId', event.target.value)}
                                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                                >
                                                    <option value="">Select station</option>
                                                    {stations.map((station) => (
                                                        <option key={station.id} value={station.id}>{station.station_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {signupRole === 'admin' && (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={signupForm.admin.adminCode}
                                                    onChange={(event) => setRoleField('admin', 'adminCode', event.target.value)}
                                                    placeholder="Admin Code"
                                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                                />
                                                <select
                                                    value={signupForm.admin.stationId}
                                                    onChange={(event) => {
                                                        const newStationId = event.target.value;
                                                        setRoleField('admin', 'stationId', newStationId);
                                                        
                                                        // Automatically set the verification code if a station is selected
                                                        if (newStationId) {
                                                            const selectedStation = stations.find(s => s.id === newStationId);
                                                            if (selectedStation) {
                                                                setRoleField('admin', 'stationVerificationCode', selectedStation.admin_verification_code);
                                                            }
                                                        } else {
                                                            setRoleField('admin', 'stationVerificationCode', '');
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                                >
                                                    <option value="">Select station</option>
                                                    {stations.map((station) => (
                                                        <option key={station.id} value={station.id}>{station.station_name}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    value={signupForm.admin.stationVerificationCode}
                                                    onChange={(event) => setRoleField('admin', 'stationVerificationCode', event.target.value)}
                                                    placeholder="Station Verification Code"
                                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1f4f99] focus:outline-none focus:ring-2 focus:ring-[#1f4f99]/20"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCodes((prev) => !prev)}
                                                    className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0b2447]"
                                                >
                                                    {showCodes ? 'Hide Demo Station Codes' : 'Show Demo Station Codes'}
                                                </button>
                                                {showCodes && (
                                                    <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                                        {stations.map((station) => (
                                                            <div key={station.id} className="flex justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
                                                                <span className="font-semibold text-slate-700">{station.station_code}</span>
                                                                <span className="text-slate-500">{station.admin_verification_code}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2447] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14376d] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {loading ? 'Creating account...' : `Create ${signupRole} account`}
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p>Copyright {new Date().getFullYear()} E-Traffic SaaS Platform. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-4">
                        <a href="#about" className="font-semibold text-slate-700 hover:text-[#0b2447]">About</a>
                        <a href="#how" className="font-semibold text-slate-700 hover:text-[#0b2447]">How to Use</a>
                        <a href="#benefits" className="font-semibold text-slate-700 hover:text-[#0b2447]">Benefits</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
