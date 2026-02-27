import React, { useMemo, useState } from 'react';
import { CheckCircle2, CreditCard, Loader2, QrCode } from 'lucide-react';
import Modal from '../UI/Modal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const VisaIcon = ({ className = '' }) => (
    <svg viewBox="0 0 48 16" aria-hidden="true" className={className}>
        <rect x="0.5" y="0.5" width="47" height="15" rx="3" fill="#1A1F71" stroke="rgba(15,23,42,0.18)" />
        <path
            d="M13.1 11.8 15.7 4.2h1.8l-2.6 7.6h-1.8ZM21.8 4.1c-.6 0-1 .2-1.2.7l-3 7h1.9l.4-1h2.3l.2 1h1.7l-1.5-7.7h-.8Zm-.7 5.3.8-2.1.4 2.1h-1.2ZM28.6 4.2l-1.5 7.6h-1.7l1.5-7.6h1.7ZM33.9 4.4l-.2 1.3c-.4-.2-.9-.3-1.4-.3-.6 0-1 .2-1 .5 0 .8 2.3.8 2.3 2.5 0 1.4-1.3 2.4-3.1 2.4-.7 0-1.5-.2-2-.4l.3-1.3c.5.2 1.2.4 1.9.4.5 0 1.1-.2 1.1-.7 0-.9-2.3-.7-2.3-2.5 0-1.3 1.2-2.2 2.9-2.2.6 0 1.1.1 1.5.3Z"
            fill="#fff"
            opacity="0.98"
        />
    </svg>
);

const MasterCardIcon = ({ className = '' }) => (
    <svg viewBox="0 0 48 16" aria-hidden="true" className={className}>
        <rect x="0.5" y="0.5" width="47" height="15" rx="3" fill="#111827" stroke="rgba(15,23,42,0.18)" />
        <circle cx="21" cy="8" r="4.4" fill="#EB001B" />
        <circle cx="27" cy="8" r="4.4" fill="#F79E1B" />
        <path d="M24 3.9c1.2.8 2 2.3 2 4.1s-.8 3.3-2 4.1c-1.2-.8-2-2.3-2-4.1s.8-3.3 2-4.1Z" fill="#FF5F00" />
        <path
            d="M33.8 11.6V4.4h2.3c.9 0 1.5.2 2 .6.4.4.6.9.6 1.6 0 .5-.1.9-.4 1.2-.2.3-.6.5-1 .6.4.1.7.3 1 .6.2.3.4.7.4 1.2 0 .7-.2 1.3-.7 1.7-.5.4-1.2.6-2.1.6h-2.1Zm1.5-4.3h.7c.8 0 1.2-.3 1.2-1s-.4-1-1.2-1h-.7v2Zm0 3h.8c.9 0 1.3-.3 1.3-1.1 0-.7-.4-1.1-1.3-1.1h-.8v2.2Z"
            fill="#fff"
            opacity="0.9"
        />
    </svg>
);

const PaymentModal = ({ isOpen, onClose, fine }) => {
    const { payFine } = useData();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [method, setMethod] = useState('card');
    const [step, setStep] = useState('details'); // details | otp
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [error, setError] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardScheme, setCardScheme] = useState('Visa'); // 'Visa' | 'MasterCard'

    const maskedNic = useMemo(() => {
        const nic = (fine?.offenderNic || '').trim();
        if (!nic) return 'Not captured';
        if (nic.length <= 4) return '****';
        return `${nic.slice(0, 4)}****${nic.slice(-2)}`;
    }, [fine?.offenderNic]);

    const completePayment = () => {
        if (!fine) return;
        setLoading(true);
        payFine(fine.id, {
            method,
            channel: method === 'qr' ? 'lankaqr' : 'card',
            payerUserId: user?.id || null,
            meta: {
                fineId: fine.id,
                maskedNic,
                cardScheme: method === 'card' ? cardScheme : null,
            }
        });
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            onClose();
            setMethod('card');
            setStep('details');
            setOtp('');
            setGeneratedOtp('');
            setError('');
            setCardNumber('');
            setCardScheme('Visa');
        }, 1500);
    };

    const handleCardSubmit = (event) => {
        event.preventDefault();
        const nextOtp = String(Math.floor(100000 + Math.random() * 900000));
        setGeneratedOtp(nextOtp);
        setStep('otp');
    };

    if (success) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Payment Successful">
                <div className="py-7 text-center">
                    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h4 className="mt-4 text-xl font-bold text-slate-900">Payment Confirmed</h4>
                    <p className="mt-1 text-sm text-slate-600">Receipt generated for fine #{fine?.id}.</p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Pay Fine #${fine?.id || ''}`}>
            <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Official fine details</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <span className="text-slate-500">Reference</span>
                        <span className="text-right font-semibold text-slate-800">{fine?.id}</span>
                        <span className="text-slate-500">Violation</span>
                        <span className="text-right font-semibold text-slate-800">{fine?.violation}</span>
                        <span className="text-slate-500">Date</span>
                        <span className="text-right font-semibold text-slate-800">{fine?.date}</span>
                        <span className="text-slate-500">Location</span>
                        <span className="text-right font-semibold text-slate-800">{fine?.location}</span>
                        <span className="text-slate-500">Vehicle</span>
                        <span className="text-right font-semibold text-slate-800">{fine?.vehicleNo || 'Not specified'}</span>
                        <span className="text-slate-500">NIC</span>
                        <span className="text-right font-semibold text-slate-800">{maskedNic}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
                    <button
                        type="button"
                        onClick={() => setMethod('card')}
                        className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                            method === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <CreditCard className="mr-1 inline h-4 w-4" />
                        Card
                    </button>
                    <button
                        type="button"
                        onClick={() => setMethod('qr')}
                        className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                            method === 'qr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <QrCode className="mr-1 inline h-4 w-4" />
                        QR
                    </button>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Total Amount</p>
                    <p className="mt-1 text-3xl font-extrabold text-blue-900">Rs. {Number(fine?.amount || 0).toLocaleString()}</p>
                </div>

                {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                        {error}
                    </div>
                )}

                {step === 'otp' ? (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (!otp.trim()) {
                                setError('Enter the OTP code.');
                                return;
                            }
                            if (otp.trim() !== generatedOtp) {
                                setError('Invalid OTP code. Please try again.');
                                return;
                            }
                            setError('');
                            completePayment();
                        }}
                        className="space-y-4"
                    >
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">Security verification</p>
                            <p className="mt-1 text-sm">We sent a one-time password (OTP) to your registered contact.</p>
                            <p className="mt-1 text-xs text-amber-800">Demo OTP: <span className="font-bold">{generatedOtp}</span></p>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">OTP Code</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="6-digit code"
                                className="input-control"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value.replace(/\D/g, ''));
                                    setError('');
                                }}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="btn-soft w-full"
                                onClick={() => {
                                    const nextOtp = String(Math.floor(100000 + Math.random() * 900000));
                                    setGeneratedOtp(nextOtp);
                                    setOtp('');
                                    setError('');
                                }}
                                disabled={loading}
                            >
                                Resend OTP
                            </button>
                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm & Pay'
                                )}
                            </button>
                        </div>
                    </form>
                ) : method === 'card' ? (
                    <form onSubmit={handleCardSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <span>Card Number</span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                                    {cardScheme}
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                className="input-control"
                                value={cardNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^\d ]/g, '');
                                    setCardNumber(value);
                                }}
                                required
                            />
                            <div className="mt-2 flex gap-2">
                                <button
                                    type="button"
                                    className={`flex-1 rounded-lg border px-2 py-1 text-xs font-semibold ${
                                        cardScheme === 'Visa'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-slate-200 bg-white text-slate-600'
                                    }`}
                                    onClick={() => setCardScheme('Visa')}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <VisaIcon className="h-4 w-auto" />
                                        <span>Visa</span>
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 rounded-lg border px-2 py-1 text-xs font-semibold ${
                                        cardScheme === 'MasterCard'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-slate-200 bg-white text-slate-600'
                                    }`}
                                    onClick={() => setCardScheme('MasterCard')}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <MasterCardIcon className="h-4 w-auto" />
                                        <span>MasterCard</span>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Expiry</label>
                                <input type="text" placeholder="MM/YY" className="input-control" required />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">CVC</label>
                                <input type="password" placeholder="***" className="input-control" required />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            Continue
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4 text-center">
                        <div className="mx-auto w-fit rounded-2xl border border-slate-200 bg-white p-3">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=pay_fine_${fine?.id}_amount_${fine?.amount}`}
                                alt="QR code to pay fine"
                                className="h-[180px] w-[180px]"
                            />
                        </div>
                        <p className="text-sm text-slate-600">Scan this code with your banking app to confirm payment securely.</p>
                        <button
                            type="button"
                            onClick={() => {
                                const nextOtp = String(Math.floor(100000 + Math.random() * 900000));
                                setGeneratedOtp(nextOtp);
                                setStep('otp');
                                setError('');
                            }}
                            disabled={loading}
                            className="btn-soft w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default PaymentModal;
