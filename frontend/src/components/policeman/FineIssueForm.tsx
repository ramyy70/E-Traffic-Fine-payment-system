import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, QrCode, CheckCircle, X } from 'lucide-react';

const OFFICIAL_OFFENCES = [
  { key: "identification_plates", amount: 1000 },
  { key: "no_revenue_license", amount: 1000 },
  { key: "contravening_rl", amount: 1000 },
  { key: "driving_emergency_no_dl", amount: 1000 },
  { key: "driving_special_no_dl", amount: 1000 },
  { key: "driving_hazardous_no_dl", amount: 1000 },
  { key: "no_specific_class_dl", amount: 1000 },
  { key: "no_dl_carried", amount: 1000 },
  { key: "no_instructor_license", amount: 2000 },
  { key: "speeding", amount: 3000 },
  { key: "disobeying_road_rules", amount: 2000 },
  { key: "obstructing_control", amount: 1000 },
  { key: "no_signals", amount: 1000 },
  { key: "reversing_long_distance", amount: 1000 },
  { key: "improper_signals", amount: 1000 },
  { key: "smoke_emission", amount: 1000 },
  { key: "riding_running_boards", amount: 500 },
  { key: "excess_front_seat", amount: 1000 },
  { key: "no_seat_belts", amount: 1000 },
  { key: "no_helmet", amount: 1000 },
  { key: "improper_ads", amount: 1000 },
  { key: "excessive_noise", amount: 1000 },
  { key: "disobeying_police_signals", amount: 2000 },
  { key: "not_following_signals", amount: 1000 },
  { key: "fueling_precautions", amount: 1000 },
  { key: "improper_halting_parking", amount: 1000 },
  { key: "parking_precautions", amount: 2000 },
  { key: "excess_passengers_car", amount: 500 },
  { key: "excess_passengers_bus", amount: 500 },
  { key: "excess_goods", amount: 500 },
  { key: "excess_persons_lorry", amount: 500 },
  { key: "violation_regulations", amount: 1000 },
  { key: "no_emission_certificate", amount: 500 }
];

const FineIssueForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    driver_name: '',
    driver_nic: '',
    driver_address: '',
    vehicle_number: '',
    date_of_offence: '',
    nature_of_offence: '',
    fine_amount: '',
    dl_tp_no: '',
    valid_time_from: '',
    valid_time_to: '',
    competent_to_drive_new_dl: false,
    competent_to_drive_old_dl: false,
    police_station: '',
    court_date: '',
    issuing_officer: '',
    policeman_number: '',
    rank: '',
    time_of_offence: '',
    place_of_offence: ''
  });

  useEffect(() => {
    const sessionUserStr = localStorage.getItem('user');
    if (sessionUserStr) {
      const user = JSON.parse(sessionUserStr);
      if (user.role === 'policeman') {
        setFormData(prev => ({
          ...prev,
          police_station: user.assigned_station || '',
          issuing_officer: user.full_name || '',
          policeman_number: user.badge_number || '',
          rank: user.rank || ''
        }));
      }
    }
  }, []);

  const [selectedOffences, setSelectedOffences] = useState<{key: string, name: string, amount: number}[]>([]);
  const [currentOffence, setCurrentOffence] = useState('');
  const [customOffence, setCustomOffence] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedQrCode, setGeneratedQrCode] = useState<string | null>(null);

  const handleAddOffence = () => {
    if (currentOffence === 'Other') {
      if (!customOffence || !customAmount) return;
      setSelectedOffences([...selectedOffences, { key: 'other', name: customOffence, amount: Number(customAmount) }]);
      setCustomOffence('');
      setCustomAmount('');
    } else if (currentOffence) {
      const offence = OFFICIAL_OFFENCES.find(o => o.key === currentOffence);
      if (offence) {
        setSelectedOffences([...selectedOffences, { key: offence.key, name: t(`offences.${offence.key}`), amount: offence.amount }]);
      }
    }
    setCurrentOffence('');
  };

  const handleRemoveOffence = (index: number) => {
    const newList = [...selectedOffences];
    newList.splice(index, 1);
    setSelectedOffences(newList);
  };

  const totalAmount = selectedOffences.reduce((sum, o) => sum + o.amount, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    if (name === 'valid_time_from') {
      const fromDateStr = val as string;
      if (fromDateStr) {
        const fromDate = new Date(fromDateStr);
        const toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 14);
        const toDateStr = toDate.toISOString().split('T')[0];
        setFormData({
          ...formData,
          valid_time_from: fromDateStr,
          valid_time_to: toDateStr
        });
      } else {
        setFormData({ ...formData, [name]: val });
      }
    } else {
      setFormData({ ...formData, [name]: val });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOffences.length === 0) {
      return setError(t('fineIssue.errorNoOffence'));
    }
    setError('');
    setIsLoading(true);

    try {
      const sessionUserStr = localStorage.getItem('user');
      const policeman_id = sessionUserStr ? JSON.parse(sessionUserStr).id : 'missing';

      const payload = {
        ...formData,
        nature_of_offence: selectedOffences.map(o => o.name).join(', '),
        fine_amount: totalAmount,
        policeman_id
      };

      const res = await fetch('http://localhost:5000/api/fines/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to issue fine');

      setGeneratedQrCode(data.fine.qr_code_url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGeneratedQrCode(null);
    const sessionUserStr = localStorage.getItem('user');
    const user = sessionUserStr ? JSON.parse(sessionUserStr) : null;

    setFormData({
      driver_name: '', driver_nic: '', driver_address: '', vehicle_number: '',
      date_of_offence: '', nature_of_offence: '', fine_amount: '', dl_tp_no: '', valid_time_from: '', valid_time_to: '',
      competent_to_drive_new_dl: false, competent_to_drive_old_dl: false,
      police_station: user?.assigned_station || '',
      court_date: '',
      issuing_officer: user?.full_name || '',
      policeman_number: user?.badge_number || '',
      rank: user?.rank || '',
      time_of_offence: '',
      place_of_offence: ''
    });
    setSelectedOffences([]);
    setCurrentOffence('');
    setCustomOffence('');
    setCustomAmount('');
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto my-8 relative">

      {/* Success QR Code Modal */}
      {generatedQrCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={resetForm} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{t('fineIssue.successTitle')}</h3>
              <p className="text-gray-500 mt-2">{t('fineIssue.successSubtitle')}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-300 flex justify-center mb-6">
              <img src={generatedQrCode} alt="Payment QR Code" className="w-56 h-56 object-contain" />
            </div>

            <button onClick={resetForm} className="w-full flex items-center justify-center gap-2 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon-dark transition-colors">
              <QrCode className="w-5 h-5" /> {t('fineIssue.doneBtn')}
            </button>
          </div>
        </div>
      )}

      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">{t('fineIssue.title')}</h2>
        <p className="text-gray-500">{t('fineIssue.subtitle')}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Driver Details Section */}
        <div>
          <h3 className="text-lg font-bold text-maroon border-b border-maroon/20 pb-2 mb-4">{t('fineIssue.driverDetails')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fineIssue.driverNic')}</label>
              <input type="text" name="driver_nic" value={formData.driver_nic} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon bg-yellow-50" placeholder="e.g. 199012345678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fineIssue.driverName')}</label>
              <input type="text" name="driver_name" value={formData.driver_name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fineIssue.driverAddress')}</label>
              <input type="text" name="driver_address" value={formData.driver_address} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fineIssue.vehicleNumber')}</label>
              <input type="text" name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
          </div>
        </div>

        {/* Offence Details Section */}
        <div>
          <h3 className="text-lg font-bold text-maroon border-b border-maroon/20 pb-2 mb-4">{t('fineIssue.offenceInfo')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 mb-3">{t('offences.addOffenceTitle') || 'Add Offences'}</label>
                           <div className="grid grid-cols-[1fr_112px] gap-2 mb-4">
                <select 
                  value={currentOffence} 
                  onChange={(e) => setCurrentOffence(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon min-w-0"
                >
                  <option value="">{t('offences.selectOffence')}</option>
                  {OFFICIAL_OFFENCES.map((offence, idx) => (
                    <option key={idx} value={offence.key}>{t(`offences.${offence.key}`)} ({t('common.currency')} {offence.amount})</option>
                  ))}
                  <option value="Other">{t('offences.other')}</option>
                </select>
                <button 
                  type="button"
                  onClick={handleAddOffence}
                  className="w-28 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon-dark transition-colors flex items-center justify-center whitespace-nowrap text-[10px] uppercase tracking-tighter"
                >
                  {t('offences.add')}
                </button>
              </div>

              {currentOffence === 'Other' && (
                <div className="grid grid-cols-2 gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
                  <input
                    type="text"
                    placeholder={t('offences.customPlaceholder') || "Describe offence..."}
                    value={customOffence}
                    onChange={(e) => setCustomOffence(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl"
                  />
                  <input
                    type="number"
                    placeholder={t('offences.amountPlaceholder') || "Amount"}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
              )}

              {/* Selected Offences List */}
              {selectedOffences.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('offences.selectedList') || 'Selected Offences'}:</p>
                  {selectedOffences.map((off, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">{off.name}</span>
                        <span className="text-xs text-gray-500">{t('common.currency')} {off.amount}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveOffence(idx)}
                        className="p-1 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fineIssue.licenseNumber')}</label>
              <input type="text" name="dl_tp_no" value={formData.dl_tp_no} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fineIssue.dateOfOffence')}</label>
              <input type="date" name="date_of_offence" value={formData.date_of_offence} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fineIssue.placeOfOffence')}</label>
              <input type="text" name="place_of_offence" value={formData.place_of_offence} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" placeholder={t('fineIssue.placePlaceholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fineIssue.timeOfOffence')}</label>
              <input type="time" name="time_of_offence" value={formData.time_of_offence} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
            <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('offences.totalFine')}</span>
                <span className="text-3xl font-black text-maroon">{t('common.currency')} {totalAmount}</span>
              </div>
              <div className="text-right text-xs text-gray-400 max-w-[200px]">
                {selectedOffences.length} {t('offences.offencesCount')}
              </div>
            </div>
          </div>
        </div>



        <div className="border-t pt-6 flex justify-end">
          <button type="button" onClick={resetForm} className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 mr-4 font-bold transition-colors">
            {t('fineIssue.clearForm')}
          </button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-3 bg-maroon text-white rounded-full hover:bg-maroon-dark font-bold shadow-lg shadow-maroon/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
            {t('fineIssue.submitBtn')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FineIssueForm;
