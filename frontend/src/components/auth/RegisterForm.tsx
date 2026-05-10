import { useState } from 'react';
import { User, Shield, Key, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { POLICE_STATIONS } from '../../utils/stationDirectory';

type Role = 'driver' | 'policeman' | 'admin';

const RegisterForm = () => {
  const [role, setRole] = useState<Role>('policeman');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    nic: '',
    address: '',
    badge_number: '',
    rank: '',
    assigned_station: '',
    station_name: '',
    admin_code: '',
    dob: '',
    license_number: '',
    expiry_date: '',
    address_line_1: '',
    city: '',
    postal_code: '',
    station_verification_code: ''
  });

  const POSTAL_CODES: Record<string, string> = {
    // Western Province
    "Colombo 01 (Fort)": "00100",
    "Colombo 02 (Slave Island)": "00200",
    "Colombo 03 (Colpetty)": "00300",
    "Colombo 04 (Bambalapitiya)": "00400",
    "Colombo 05 (Havelock Town)": "00500",
    "Colombo 06 (Wellawatte)": "00600",
    "Colombo 07 (Cinnamon Gardens)": "00700",
    "Colombo 08 (Borella)": "00800",
    "Colombo 09 (Dematagoda)": "00900",
    "Colombo 10 (Maradana)": "01000",
    "Colombo 11 (Pettah)": "01100",
    "Colombo 12 (Hultsdorf)": "01200",
    "Colombo 13 (Kotahena)": "01300",
    "Colombo 14 (Grandpass)": "01400",
    "Colombo 15 (Mutwal)": "01500",
    "Dehiwala": "10350",
    "Mount Lavinia": "10370",
    "Ratmalana": "10390",
    "Moratuwa": "10400",
    "Panadura": "12500",
    "Kalutara": "12000",
    "Negombo": "11500",
    "Gampaha": "11000",
    "Wattala": "11300",
    "Ja-Ela": "11350",
    "Kadawatha": "11850",
    "Kiribathgoda": "11600",
    "Kaduwela": "10170",
    "Malabe": "10115",
    "Battaramulla": "10120",
    "Maharagama": "10280",
    "Kottawa": "10230",
    "Homagama": "10200",
    "Avissawella": "10700",
    
    // Central Province
    "Kandy": "20000",
    "Peradeniya": "20400",
    "Gampola": "20500",
    "Nawalapitiya": "20650",
    "Matale": "21000",
    "Dambulla": "21100",
    "Nuwara Eliya": "22200",
    "Hatton": "22000",
    "Talawakele": "22100",
    
    // Southern Province
    "Galle": "80000",
    "Hikkaduwa": "80240",
    "Ambalangoda": "80300",
    "Bentota": "80500",
    "Matara": "81000",
    "Weligama": "81700",
    "Hambantota": "82000",
    "Tangalle": "82200",
    "Tissamaharama": "82600",
    
    // Northern Province
    "Jaffna": "40000",
    "Chavakachcheri": "40500",
    "Point Pedro": "40500",
    "Kilinochchi": "42000",
    "Mannar": "41000",
    "Vavuniya": "43000",
    "Mullaitivu": "42000",
    
    // Eastern Province
    "Trincomalee": "31000",
    "Batticaloa": "30000",
    "Ampara": "32000",
    "Kalmunai": "32300",
    "Eravur": "30300",
    
    // North Western Province
    "Kurunegala": "60000",
    "Kuliyapitiya": "60200",
    "Puttalam": "61000",
    "Chilaw": "61000",
    "Marawila": "61210",
    "Wennappuwa": "61160",
    
    // North Central Province
    "Anuradhapura": "50000",
    "Polonnaruwa": "51000",
    "Hingurakgoda": "51400",
    
    // Uva Province
    "Badulla": "90000",
    "Bandarawela": "90100",
    "Haputale": "90160",
    "Moneragala": "91000",
    "Wellawaya": "91200",
    "Kataragama": "91400",
    
    // Sabaragamuwa Province
    "Ratnapura": "70000",
    "Balangoda": "70100",
    "Embilipitiya": "70200",
    "Kegalle": "71000",
    "Mawanella": "71500"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'city') {
      const matchedCity = Object.keys(POSTAL_CODES).find(
        city => city.toLowerCase() === value.toLowerCase()
      );
      
      if (matchedCity) {
        setFormData({ 
          ...formData, 
          city: value, 
          postal_code: POSTAL_CODES[matchedCity] 
        });
        return;
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload: any = {
        role,
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password
      };

      if (role === 'driver') {
        payload.nic = formData.nic;
        // Map address fields to the original 'address' column if the backend hasn't been updated,
        // or just construct a full string, or simply set address_line_1 if we just want it to run without breaking
        payload.address = `${formData.address_line_1}, ${formData.city} ${formData.postal_code}`;
        // Additional new fields (will be ignored by backend if not in schema)
        payload.dob = formData.dob;
        payload.license_number = formData.license_number;
        payload.expiry_date = formData.expiry_date;
      } else if (role === 'policeman') {
        payload.badge_number = formData.badge_number;
        payload.rank = formData.rank;
        payload.assigned_station = formData.assigned_station;
      } else if (role === 'admin') {
        payload.station_name = formData.station_name;
        // The UI no longer requests an address for admin; if required by backend, send a default or placeholder
        payload.address = 'Not Provided'; 
        payload.admin_code = formData.admin_code;
        payload.station_verification_code = formData.station_verification_code;
      }

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed');

      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon/50 transition-all font-medium text-sm";
  const labelClass = "block text-[11px] uppercase tracking-wide font-bold text-gray-600 mb-1.5 ml-1";

  return (
    <div className="w-full">
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-center mb-6">
             <img src="/src/assets/logo.png" alt="Lanka FinePayments Logo" className="w-20 h-20 object-contain drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#111928] mb-1 tracking-tight">Personal Details</h2>
          <p className="text-gray-500 text-sm mb-6 font-medium">Step 1 of 2 • Configure your basic credentials</p>
          
          {/* Progress Bar */}
          <div className="flex gap-2 mb-10 w-3/4">
            <div className="h-1 flex-1 bg-yellow-500 rounded-full"></div>
            <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
          </div>
          
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Select Account Type</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { id: 'policeman', icon: <Shield className="w-6 h-6" />, label: 'Police' },
              { id: 'driver', icon: <User className="w-6 h-6" />, label: 'Driver' },
              { id: 'admin', icon: <Key className="w-6 h-6" />, label: 'Admin' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => { setRole(r.id as Role); setError(''); }}
                className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border transition-all ${
                  role === r.id 
                  ? 'border-maroon/20 bg-white shadow-lg shadow-maroon/5 text-maroon' 
                  : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              >
                {r.icon}
                <span className={`text-xs font-bold ${role === r.id ? 'text-maroon' : 'text-gray-500'}`}>{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleNextStep} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-center text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required placeholder="Jane Doe" className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required placeholder="+94 77 123 4567" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@example.com" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Create Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min. 8 characters" className={inputClass} minLength={8} />
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required placeholder="Repeat password" className={inputClass} minLength={8} />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-sm shadow-maroon/20 text-sm font-bold text-white bg-[#8B1A2F] hover:bg-maroon-dark focus:outline-none transition-all transform hover:-translate-y-0.5 mt-4"
            >
              Continue to Next Step <ArrowRight className="w-4 h-4" />
            </button>
            
            <p className="mt-6 text-center text-gray-500 text-sm font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-bold hover:underline transition-all">
                Sign in securely
              </Link>
            </p>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <h2 className="text-3xl font-extrabold text-[#111928] mb-1 tracking-tight">
            {role === 'driver' && 'Driver Verification'}
            {role === 'policeman' && 'Professional Validation'}
            {role === 'admin' && 'System Authorization'}
          </h2>
          <p className="text-gray-500 text-sm mb-6 font-medium">Step 2 of 2 • Complete your {role} profile</p>
          
          {/* Progress Bar */}
          <div className="flex gap-2 mb-10 w-3/4">
            <div className="h-1 flex-1 bg-yellow-500 rounded-full"></div>
            <div className="h-1 flex-1 bg-yellow-500 rounded-full"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-center text-sm font-medium">
                {error}
              </div>
            )}

            {role === 'driver' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>National ID (NIC)</label>
                    <input type="text" name="nic" value={formData.nic} onChange={handleChange} required placeholder="199012345678" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>License Number</label>
                    <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} required placeholder="B1234567" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Expiry Date</label>
                    <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} required className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Address Line 1</label>
                  <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleChange} required placeholder="123 Main Street" className={inputClass} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>City</label>
                    <input 
                      type="text" 
                      name="city" 
                      list="city-list"
                      value={formData.city} 
                      onChange={handleChange} 
                      required 
                      placeholder="Colombo" 
                      className={inputClass} 
                    />
                    <datalist id="city-list">
                      {Object.keys(POSTAL_CODES).map(city => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} required placeholder="00100" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {role === 'policeman' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Badge Number</label>
                    <input type="text" name="badge_number" value={formData.badge_number} onChange={handleChange} required placeholder="POL-12345" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Rank</label>
                    <select name="rank" value={formData.rank} onChange={handleChange} required className={inputClass}>
                      <option value="">Select Rank</option>
                      <option value="Police Constable (PC)">Police Constable (PC)</option>
                      <option value="Police Sergeant (PS)">Police Sergeant (PS)</option>
                      <option value="Sub Inspector (SI)">Sub Inspector (SI)</option>
                      <option value="Inspector of Police (IP)">Inspector of Police (IP)</option>
                      <option value="Chief Inspector of Police (CI)">Chief Inspector of Police (CI)</option>
                      <option value="Assistant Superintendent of Police (ASP)">Assistant Superintendent of Police (ASP)</option>
                      <option value="Superintendent of Police (SP)">Superintendent of Police (SP)</option>
                      <option value="Senior Superintendent of Police (SSP)">Senior Superintendent of Police (SSP)</option>
                      <option value="Deputy Inspector General of Police (DIG)">Deputy Inspector General of Police (DIG)</option>
                      <option value="Senior Deputy Inspector General of Police (SDIG)">Senior Deputy Inspector General of Police (SDIG)</option>
                      <option value="Inspector General of Police (IGP)">Inspector General of Police (IGP)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Assigned Station</label>
                  <select name="assigned_station" value={formData.assigned_station} onChange={handleChange} required className={inputClass}>
                    <option value="">Select a police station</option>
                    {POLICE_STATIONS.map((station, idx) => (
                      <option key={idx} value={station}>{station} Police Station</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {role === 'admin' && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Admin Code</label>
                  <input type="text" name="admin_code" value={formData.admin_code} onChange={handleChange} required placeholder="ADM-123" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Managing Station</label>
                  <select name="station_name" value={formData.station_name} onChange={handleChange} required className={inputClass}>
                    <option value="">Select a police station</option>
                    {POLICE_STATIONS.map((station, idx) => (
                      <option key={idx} value={station}>{station}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Station Verification Code</label>
                  <input type="text" name="station_verification_code" value={formData.station_verification_code} onChange={handleChange} required placeholder="Verification Code" className={inputClass} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 flex justify-center items-center py-4 px-4 rounded-xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-[#8B1A2F] hover:bg-maroon-dark focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-4 h-4" />}
                Complete Registration
              </button>
            </div>
            
            <p className="mt-6 text-center text-gray-500 text-sm font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-bold hover:underline transition-all">
                Sign in securely
              </Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
