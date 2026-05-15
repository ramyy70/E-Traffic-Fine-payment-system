import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Loader2, ShieldCheck, BadgeInfo, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    nic: '',
    badge_number: '',
    station_name: '',
    role: ''
  });

  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!userObj) {
      window.location.href = '/login';
      return;
    }
    // Set initial values from localStorage while we fetch latest
    setFormData({
      full_name: userObj.full_name || '',
      email: userObj.email || '',
      phone_number: userObj.phone_number || '',
      nic: userObj.nic || '',
      badge_number: userObj.badge_number || '',
      station_name: userObj.station_name || '',
      role: userObj.role || ''
    });
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userObj?.id) return;
    
    setSubmitting(true);
    setErrorMsg('');
    setSuccess('');
    
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userObj.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          station_name: formData.station_name
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      
      // Update local storage
      const updatedUser = { ...userObj, full_name: formData.full_name, phone_number: formData.phone_number, station_name: formData.station_name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess(t('profile.updatedSuccess'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-maroon" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 mt-24 px-4 w-full max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('profile.title')}</h1>

        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative">
          <div className="h-32 bg-maroon relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full mix-blend-overlay filter blur-3xl opacity-70"></div>
          </div>
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex justify-between items-end">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-sm border border-gray-100">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div className="mb-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-blue-100">
                <ShieldCheck className="w-4 h-4" />
                {t(`auth.${formData.role}`).toUpperCase()}
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-medium">
                {errorMsg}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('profile.fullName')}</label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-maroon focus:ring-maroon transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('profile.phoneNumber')}</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-maroon focus:ring-maroon transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('profile.emailReadOnly')}</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      value={formData.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {formData.role === 'driver' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('profile.nicReadOnly')}</label>
                    <div className="relative">
                      <BadgeInfo className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.nic}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed uppercase font-mono"
                      />
                    </div>
                  </div>
                )}

                {formData.role === 'policeman' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('profile.badgeReadOnly')}</label>
                      <div className="relative">
                        <BadgeInfo className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          value={formData.badge_number}
                          readOnly
                          className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('profile.stationName')}</label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          name="station_name"
                          value={formData.station_name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-maroon focus:ring-maroon transition-colors"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 mt-8">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-8 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon-dark transition-colors shadow-md flex items-center justify-center min-w-[160px]"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('profile.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
