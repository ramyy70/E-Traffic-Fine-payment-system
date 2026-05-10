import { useState, useEffect } from 'react';
import { Loader2, QrCode, CheckCircle, X } from 'lucide-react';

const OFFICIAL_OFFENCES = [
  { name: "Identification plates", amount: 1000 },
  { name: "Not carrying Revenue License (R.L.)", amount: 1000 },
  { name: "Contravening R.L. provisions", amount: 1000 },
  { name: "Driving emergency/service vehicles without D.L.", amount: 1000 },
  { name: "Driving special purpose vehicles without license", amount: 1000 },
  { name: "Driving hazardous loaded vehicle without license", amount: 1000 },
  { name: "Not having license for specific class", amount: 1000 },
  { name: "Not carrying driving license", amount: 1000 },
  { name: "Not having instructor’s license", amount: 2000 },
  { name: "Contravening speed limits", amount: 3000 },
  { name: "Disobeying road rules", amount: 2000 },
  { name: "Obstructing control of vehicle", amount: 1000 },
  { name: "Failure to give signals", amount: 1000 },
  { name: "Reversing for long distance", amount: 1000 },
  { name: "Improper sound/light signals", amount: 1000 },
  { name: "Excessive smoke emission", amount: 1000 },
  { name: "Riding on running boards", amount: 500 },
  { name: "Excess persons in front seat", amount: 1000 },
  { name: "Not using seat belts", amount: 1000 },
  { name: "Not wearing helmet", amount: 1000 },
  { name: "Improper advertisements", amount: 1000 },
  { name: "Excessive noise", amount: 1000 },
  { name: "Disobeying police/traffic signals", amount: 2000 },
  { name: "Not following traffic signals", amount: 1000 },
  { name: "No precautions when fueling", amount: 1000 },
  { name: "Improper halting/parking", amount: 1000 },
  { name: "No precautions when parking", amount: 2000 },
  { name: "Excess passengers (car/private coach)", amount: 500 },
  { name: "Excess passengers (omnibus)", amount: 500 },
  { name: "Excess goods (lorry/motor tricycle)", amount: 500 },
  { name: "Excess persons in lorry", amount: 500 },
  { name: "Violation of motor vehicle regulations", amount: 1000 },
  { name: "No emission/fitness certificate", amount: 500 }
];

const FineIssueForm = () => {
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

  const [customOffence, setCustomOffence] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedQrCode, setGeneratedQrCode] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    if (e.target.name === 'nature_of_offence') {
      let amount = '';
      const selected = OFFICIAL_OFFENCES.find(o => o.name === value);
      if (selected) {
        amount = selected.amount.toString();
      }

      setFormData({
        ...formData,
        nature_of_offence: value as string,
        fine_amount: amount
      });
    } else if (e.target.name === 'valid_time_from') {
      const fromDateStr = value as string;
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
        setFormData({ ...formData, [e.target.name]: value });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Pull logged in user for auth linking (simulated structure)
      const sessionUserStr = localStorage.getItem('user');
      const policeman_id = sessionUserStr ? JSON.parse(sessionUserStr).id : 'missing';

      // Attach policeman_id and resolve custom offence logic to payload
      const payload = {
        ...formData,
        nature_of_offence: formData.nature_of_offence === 'Other' ? customOffence : formData.nature_of_offence,
        fine_amount: formData.nature_of_offence === 'Other' ? Number(formData.fine_amount) : undefined,
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
    setCustomOffence('');
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
              <h3 className="text-2xl font-bold text-gray-900">Fine Issued Successfully</h3>
              <p className="text-gray-500 mt-2">Form successfully submitted! Have the driver scan this QR code to initiate immediate payment.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-300 flex justify-center mb-6">
              <img src={generatedQrCode} alt="Payment QR Code" className="w-56 h-56 object-contain" />
            </div>

            <button onClick={resetForm} className="w-full flex items-center justify-center gap-2 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon-dark transition-colors">
              <QrCode className="w-5 h-5" /> Done & Issue Another
            </button>
          </div>
        </div>
      )}

      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Issue New Traffic Fine</h2>
        <p className="text-gray-500">Form for authorized traffic policemen to log new offences</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Driver Details Section */}
        <div>
          <h3 className="text-lg font-bold text-maroon border-b border-maroon/20 pb-2 mb-4">Driver & Vehicle Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver NIC Number (Required for DB Linking)</label>
              <input type="text" name="driver_nic" value={formData.driver_nic} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon bg-yellow-50" placeholder="e.g. 199012345678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver Full Name</label>
              <input type="text" name="driver_name" value={formData.driver_name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver Address</label>
              <input type="text" name="driver_address" value={formData.driver_address} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
              <input type="text" name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
          </div>
        </div>

        {/* Offence Details Section */}
        <div>
          <h3 className="text-lg font-bold text-maroon border-b border-maroon/20 pb-2 mb-4">Offence Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Offence</label>
              <select name="nature_of_offence" value={formData.nature_of_offence} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon">
                <option value="">Select Offence</option>
                {OFFICIAL_OFFENCES.map((offence, idx) => (
                  <option key={idx} value={offence.name}>{offence.name} (Rs. {offence.amount})</option>
                ))}
                <option value="Other">Other (Please Specify)</option>
              </select>

              {formData.nature_of_offence === 'Other' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Offence Description</label>
                  <input type="text" value={customOffence} onChange={(e) => setCustomOffence(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon bg-white" placeholder="e.g. Broken Taillight" />
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fine Payment Price (Rs.)</label>
                <input
                  type="number"
                  name="fine_amount"
                  value={formData.fine_amount}
                  onChange={handleChange}
                  required
                  min="100"
                  max="100000"
                  readOnly={formData.nature_of_offence !== 'Other' && formData.nature_of_offence !== ''}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon ${formData.nature_of_offence !== 'Other' && formData.nature_of_offence !== '' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                  placeholder={formData.nature_of_offence === '' ? "Select an offence first" : "e.g. 1500"}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input type="text" name="dl_tp_no" value={formData.dl_tp_no} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Offence</label>
              <input type="date" name="date_of_offence" value={formData.date_of_offence} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time of Offence</label>
              <input type="time" name="time_of_offence" value={formData.time_of_offence} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Place of Offence</label>
              <input type="text" name="place_of_offence" value={formData.place_of_offence} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon" placeholder="e.g. Town Hall Junction" />
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">

            </div>
          </div>
        </div>



        <div className="border-t pt-6 flex justify-end">
          <button type="button" onClick={resetForm} className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 mr-4 font-bold transition-colors">
            Clear Form
          </button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-3 bg-maroon text-white rounded-full hover:bg-maroon-dark font-bold shadow-lg shadow-maroon/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
            Submit Record & Show QR
          </button>
        </div>
      </form>
    </div>
  );
};

export default FineIssueForm;
