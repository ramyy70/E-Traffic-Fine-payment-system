import React, { useMemo, useState } from 'react';
import { AlertTriangle, CreditCard, Loader2, MapPin, Send, Truck, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { violations } from '../../data/mockData';
import { policeStationsLK } from '../../data/policeStationsLK';
import { isValidSriLankanNic, maskNic, normalizeNic } from '../../utils/identity';

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
    const { t } = useLang();
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [linkedNicMask, setLinkedNicMask] = useState('');
    const [errorKey, setErrorKey] = useState('');
    const [showStationMenu, setShowStationMenu] = useState(false);

    const policeStationSet = useMemo(
        () => new Set(policeStationsLK.map((station) => station.toLowerCase())),
        []
    );

    const filteredStations = useMemo(() => {
        const query = formData.location.trim().toLowerCase();
        if (!query) return policeStationsLK;

        return policeStationsLK.filter((station) => station.toLowerCase().includes(query));
    }, [formData.location]);

    const validate = () => {
        const nic = normalizeNic(formData.nic);
        const nicIsValid = isValidSriLankanNic(nic);

        if (!nicIsValid) return 'errInvalidNic';
        if (!formData.vehicleNo.trim()) return 'errVehicleRequired';
        if (!formData.location.trim()) return 'errLocationRequired';
        if (!policeStationSet.has(formData.location.trim().toLowerCase())) return 'errSelectValidPoliceStation';
        if (!formData.driverName.trim()) return 'errOffenderRequired';
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
            setErrorKey(validationError);
            return;
        }

        setLoading(true);

        const normalizedNic = normalizeNic(formData.nic);
        const selectedViolation = violations.find((violation) => violation.id === formData.violationId);
        issueFine({
            ...formData,
            nic: normalizedNic,
            amount: getAmount(),
            violationName: selectedViolation?.name || t('unspecifiedViolation'),
        });

        setLoading(false);
        setSuccess(true);
        setLinkedNicMask(maskNic(normalizedNic));
        setFormData(initialState);
        setErrorKey('');
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
                        {t('newTrafficViolationEntry')}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">{t('issueFineFormSub')}</p>
                </div>
                <div className="badge-pill bg-slate-100 text-slate-700">{t('officerForm')}</div>
            </div>

            {errorKey && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {t(errorKey)}
                </div>
            )}

            {success && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    <p>{t('fineIssuedSuccess')}</p>
                    {linkedNicMask && (
                        <p className="mt-1 text-xs font-medium text-emerald-700">
                            {t('fineLinkedToDriverNic', { nic: linkedNicMask })}
                        </p>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t('driverNicLicense')}
                            </label>
                            <div className="relative">
                                <CreditCard className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="input-control pl-10"
                                    placeholder={t('driverNicPlaceholder')}
                                    value={formData.nic}
                                    onChange={(event) => setFormData({ ...formData, nic: event.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t('offenderName')}
                            </label>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="input-control pl-10"
                                    placeholder={t('fullName')}
                                    value={formData.driverName}
                                    onChange={(event) => setFormData({ ...formData, driverName: event.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t('addressOptional')}
                            </label>
                            <input
                                type="text"
                                className="input-control"
                                placeholder={t('driverAddressPlaceholder')}
                                value={formData.address}
                                onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t('vehicleNumber')}
                            </label>
                            <div className="relative">
                                <Truck className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="input-control pl-10"
                                    placeholder={t('vehiclePlaceholder')}
                                    value={formData.vehicleNo}
                                    onChange={(event) => setFormData({ ...formData, vehicleNo: event.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t('location')}
                            </label>
                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="input-control pl-10"
                                    placeholder={t('locationPoliceStationPlaceholder')}
                                    autoComplete="off"
                                    value={formData.location}
                                    onFocus={() => setShowStationMenu(true)}
                                    onBlur={() => {
                                        setTimeout(() => setShowStationMenu(false), 120);
                                    }}
                                    onChange={(event) => {
                                        setFormData({ ...formData, location: event.target.value });
                                        setShowStationMenu(true);
                                    }}
                                />

                                {showStationMenu && (
                                    <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                        {filteredStations.length === 0 ? (
                                            <div className="px-3 py-2 text-sm text-slate-500">{t('noPoliceStationMatch')}</div>
                                        ) : (
                                            filteredStations.map((station) => (
                                                <button
                                                    key={station}
                                                    type="button"
                                                    className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                                    onMouseDown={(event) => {
                                                        event.preventDefault();
                                                        setFormData({ ...formData, location: station });
                                                        setShowStationMenu(false);
                                                    }}
                                                >
                                                    {station}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                {t('locationPoliceStationHint', { count: policeStationsLK.length })}
                            </p>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t('violationType')}
                            </label>
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
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{t('totalFineAmount')}</p>
                        <p className="mt-1 text-2xl font-extrabold text-slate-900">Rs. {getAmount().toLocaleString()}</p>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary px-7">
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t('processing')}
                            </>
                        ) : (
                            <>
                                {t('issueFineSheet')}
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
