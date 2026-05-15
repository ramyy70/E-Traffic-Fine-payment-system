import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden flex items-center">
      {/* Background Image with Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop" 
          alt="City Street" 
          className="w-full h-full object-cover"
        />
        {/* Split gradient matching the screenshot: deep maroon on the left, dark teal/blue on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#7a1329]/95 via-[#572744]/90 to-[#1f425b]/90 mix-blend-multiply"></div>
        {/* Secondary overlay for darkening/opacity fine-tuning */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-gray-900/60 mix-blend-overlay"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-2 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Typography & CTAs */}
        <div className="flex-1 max-w-3xl pt-0">
          <div className="mb-2">
            <img src="/src/assets/logo.png" alt="Lanka FinePayments Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-4">
            <ShieldCheck className="w-4 h-4 text-white/90" />
            <span className="text-white/90 text-xs font-bold tracking-wider uppercase">{t('hero.tagline')}</span>
          </div>
          
          <h1 className={`font-extrabold text-white leading-tight tracking-tight mb-4 ${
            i18n.language === 'en' 
              ? 'text-2xl md:text-5xl lg:text-6xl' 
              : 'text-xl md:text-4xl lg:text-5xl'
          }`}>
            {t('hero.title1')} {t('hero.title2')} {t('hero.title3')} {t('hero.title4')}
          </h1>
          
          <p className={`text-gray-200/90 mb-6 max-w-2xl leading-relaxed ${
            i18n.language === 'en' ? 'text-base md:text-lg' : 'text-sm md:text-base'
          }`}>
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t('hero.btnPrimary')}
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => document.getElementById('how-to-use')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center px-7 py-3.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
            >
              {t('hero.btnSecondary')}
            </button>
          </div>
        </div>

        {/* Right Side: Glassmorphism Cards */}
        <div className="flex-1 w-full max-w-md lg:max-w-xl flex flex-col gap-4 mt-4 lg:mt-0">
          
          {/* Platform Snapshot Card */}
          <div className="glass-dark bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 shadow-2xl">
            <h3 className="text-white/90 font-bold text-xs tracking-widest uppercase mb-4 drop-shadow-sm">
              {t('hero.snapshotTitle')}
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-900/40 rounded-xl p-3 border border-white/5">
                <p className="text-gray-400 text-[9px] mb-1">{t('hero.multiRoleAccess')}</p>
                <p className="text-white font-bold text-xl">3</p>
              </div>
              <div className="bg-gray-900/40 rounded-xl p-3 border border-white/5">
                <p className="text-gray-400 text-[9px] mb-1">{t('hero.coreModules')}</p>
                <p className="text-white font-bold text-xl">12+</p>
              </div>
              <div className="bg-gray-900/40 rounded-xl p-3 border border-white/5">
                <p className="text-gray-400 text-[9px] mb-1">{t('hero.stationVerification')}</p>
                <p className="text-white font-bold text-lg">{t('hero.enabled')}</p>
              </div>
              <div className="bg-gray-900/40 rounded-xl p-3 border border-white/5">
                <p className="text-gray-400 text-[9px] mb-1">{t('hero.auditReady')}</p>
                <p className="text-white font-bold text-lg">{t('hero.yes')}</p>
              </div>
            </div>
          </div>

          {/* Lower Informational Card */}
          <div className="glass-dark bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl">
            <p className="text-gray-300 text-[9px] md:text-[10px] leading-relaxed">
              {t('hero.schemaText')}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
