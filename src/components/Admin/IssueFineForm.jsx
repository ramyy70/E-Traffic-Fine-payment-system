import React, { useState } from 'react';
import { AlertTriangle, CreditCard, Loader2, MapPin, Send, Truck, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { violations } from '../../data/mockData';

const initialState = {
    nic: '',
    driverName: '',
    vehicleNo: '',
    location: '',
    address: '',
    violationId: violations[0].id,
};

const IssueFineForm = () => {
    const { issueFine } = useData();
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const validate = () => {
        const nic = formData.nic.trim().toUpperCase();
        const nicIsValid = (/^\d{9}[VX]$/i.test(nic) || /^\d{12}$/.test(nic));

        if (!nicIsValid) {
            return 'Enter a valid NIC (9 digits + V/X or 12 digits).';
        }
        if (!formData.vehicleNo.trim()) {
            return 'Vehicle number is required.';
        }
        if (!formData.location.trim()) {
            return 'Location is required.';
        }
        if (!formData.driverName.trim()) {
            return 'Offender name is required.';
        }
        return '';
    };

    const getAmount = () => {
        const selected = violations.find((violation) => violation.id === formData.violationId);
        return selected ? selected.amount : 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        const selectedViolation = violations.find((violation) => violation.id === formData.violationId);
        issueFine({
            ...formData,
            amount: getAmount(),
            violationName: selectedViolation?.name || 'Unspecified Violation',
        });

        setLoading(false);
        setSuccess(true);
        setFormData(initialState);
        setError('');
        setTimeout(() => setSuccess(false), 2200);
    };

    return (
        <div className="surface-card">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                    <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <AlertTriangle className="h-5 w-5" />
                        </span>
                        New Traffic Violation Entry
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">Complete all fields and submit to generate a new fine record.</p>
                </div>
                <div className="badge-pill bg-slate-100 text-slate-700">Officer Form</div>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    Fine sheet issued successfully.
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Driver NIC / License</label>
                            <div className="relative">
                                <CreditCard className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="input-control pl-10"
                                    placeholder="e.g. 901234567V"
                                    value={formData.nic}
                                    onChange={(event) => setFormData({ ...formData, nic: event.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Offender Name</label>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="input-control pl-10"
                                    placeholder="Full Name"
                                    value={formData.driverName}
                                    onChange={(event) => setFormData({ ...formData, driverName: event.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Address (Optional)</label>
                            <input
                                type="text"
                                className="input-control"
                                placeholder="Driver address"
                                value={formData.address}
                                onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Vehicle Number</label>
                            <div className="relative">
                                <Truck className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="input-control pl-10"
                                    placeholder="WP CAA-1234"
                                    value={formData.vehicleNo}
                                    onChange={(event) => setFormData({ ...formData, vehicleNo: event.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Location</label>
                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="input-control pl-10"
                                    placeholder="City / street"
                                    value={formData.location}
                                    onChange={(event) => setFormData({ ...formData, location: event.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Violation Type</label>
                            <select
                                className="input-control"
                                value={formData.violationId}
                                onChange={(event) => setFormData({ ...formData, violationId: event.target.value })}
                            >
                                {violations.map((violation) => (
                                    <option key={violation.id} value={violation.id}>
                                        {violation.name} - Rs. {violation.amount.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total Fine Amount</p>
                        <p className="mt-1 text-2xl font-extrabold text-slate-900">Rs. {getAmount().toLocaleString()}</p>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary px-7">
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Issue Fine Sheet
                                <Send className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IssueFineForm;
