import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { Send, Paperclip } from 'lucide-react';

const DEFAULT_REASON = 'Unfair Fine';

const ComplaintForm = () => {
    const { t } = useLang();
    const { submitComplaint } = useData();

    const [formData, setFormData] = useState({
        fineId: '',
        reason: DEFAULT_REASON,
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        submitComplaint(formData);
        setFormData({ fineId: '', reason: DEFAULT_REASON, description: '' });
    };

    return (
        <div className="surface-card h-full">
            <h3 className="section-title">{t('submitComplaint')}</h3>
            <p className="section-subtitle">{t('complaintFormSub')}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">{t('fineId')}</label>
                    <input
                        type="text"
                        className="input-control"
                        placeholder={t('fineIdPlaceholder')}
                        value={formData.fineId}
                        onChange={(e) => setFormData({ ...formData, fineId: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">{t('reason')}</label>
                    <select
                        className="input-control"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    >
                        <option value="Unfair Fine">{t('reasonUnfairFine')}</option>
                        <option value="Officer Misconduct">{t('reasonOfficerMisconduct')}</option>
                        <option value="System Error">{t('reasonSystemError')}</option>
                        <option value="Other">{t('reasonOther')}</option>
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">{t('description')}</label>
                    <textarea
                        className="input-control"
                        rows="4"
                        placeholder={t('complaintDescriptionPlaceholder')}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    ></textarea>
                </div>

                <div className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-500 transition hover:bg-slate-100">
                    <Paperclip className="mr-2 h-5 w-5" />
                    <span className="text-sm font-medium">{t('attachEvidenceDemo')}</span>
                </div>

                <button type="submit" className="btn-primary w-full">
                    <Send className="h-4 w-4" />
                    {t('submit')}
                </button>
            </form>
        </div>
    );
};

export default ComplaintForm;
