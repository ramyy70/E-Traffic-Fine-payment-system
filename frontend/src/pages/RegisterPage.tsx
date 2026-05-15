import RegisterForm from '../components/auth/RegisterForm';
import Navbar from '../components/common/Navbar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      {/* Left Sidebar (Dark Gradient Pane) */}
      <div className="hidden md:flex flex-col w-2/5 max-w-lg bg-gradient-to-br from-[#8B1A2F] to-[#1a111a] p-10 text-white relative overflow-hidden">
        
        {/* Faint Background Overlay matching the mock (Phone/Calculator imagery conceptual) */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay pointer-events-none"></div>

        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium w-max z-10"
        >
          <ArrowLeft className="w-4 h-4" /> {t('auth.backToPortal')}
        </button>

        <div className="mt-20 z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-yellow-600 border border-yellow-500 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            {t('auth.createAccountTag')}
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4 tracking-tight drop-shadow-sm">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-white/80 text-sm/relaxed max-w-sm mb-16 font-medium">
            {t('auth.registerSubtitle')}
          </p>

          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
               <div className="flex items-center gap-3 mb-2">
                 <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                 <h3 className="font-bold text-white text-sm">{t('auth.roleSecurityTitle')}</h3>
               </div>
               <p className="text-white/60 text-xs pl-8">
                 {t('auth.roleSecurityDesc')}
               </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
               <div className="flex items-center gap-3 mb-2">
                 <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                 <h3 className="font-bold text-white text-sm">{t('auth.centralizedRecordsTitle')}</h3>
               </div>
               <p className="text-white/60 text-xs pl-8">
                 {t('auth.centralizedRecordsDesc')}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Area (Form Pane) */}
      <div className="flex-1 flex flex-col h-full bg-white relative overflow-y-auto">
        <div className="w-full max-w-xl mx-auto my-auto p-6 lg:p-12">
          <RegisterForm />
        </div>
      </div>
      </div>
    </div>
  );
};

export default RegisterPage;
