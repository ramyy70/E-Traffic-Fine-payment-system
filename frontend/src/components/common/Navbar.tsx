import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldAlert, LogOut, User, Bell, Moon, Sun, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'si', label: 'සිංහල', short: 'සිං' },
    { code: 'ta', label: 'தமிழ்', short: 'த' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLangMenuOpen(false);
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If we are not on the homepage, navigate to homepage with hash
      navigate(`/#${id}`);
    }
  };

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:5000/api/messages/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages) {
            setNotifications(data.messages.slice(0, 4));
          }
        })
        .catch(err => console.error(err));
    }
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-full bg-white z-50 px-4 md:px-12 h-16 md:h-20 flex items-center border-b border-gray-100 shadow-sm sticky top-0">
      <nav className="w-full flex items-center justify-between">
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="flex items-center justify-center">
             <img src="/src/assets/logo.png" alt="Lanka Fine Payments Logo" className="w-14 h-14 object-contain" />
          </div>
          <div className="flex flex-col max-w-[160px] md:max-w-none">
            <span className="text-[#003366] font-extrabold text-lg md:text-xl leading-none tracking-tight truncate">{t('nav.brandName')}</span>
            <span className="text-gray-400 text-[9px] md:text-[10px] font-bold mt-1 tracking-[0.05em] uppercase truncate">{t('nav.tagline')}</span>
          </div>
        </Link>
        
        {/* Center: Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600 text-sm">
          <button onClick={() => scrollToSection('about')} className="hover:text-gray-900 transition-colors bg-transparent p-0 m-0 cursor-pointer">{t('nav.about')}</button>
          <button onClick={() => scrollToSection('how-to-use')} className="hover:text-gray-900 transition-colors bg-transparent p-0 m-0 cursor-pointer">{t('nav.howToUse')}</button>
          <button onClick={() => scrollToSection('benefits')} className="hover:text-gray-900 transition-colors bg-transparent p-0 m-0 cursor-pointer">{t('nav.benefits')}</button>
          <button onClick={() => scrollToSection('access-portal')} className="hover:text-gray-900 transition-colors bg-transparent p-0 m-0 cursor-pointer">{t('nav.accessPortal')}</button>
        </div>

        {/* Right Side: Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors bg-white border border-gray-200 rounded-full text-sm font-medium"
            >
              <Globe className="w-4 h-4 text-[#8B1A2F]" />
              <span>{currentLang.short}</span>
              <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {langMenuOpen && (
              <div className="absolute right-0 top-12 w-32 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${currentLang.code === lang.code ? 'bg-gray-50 text-[#8B1A2F] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!user ? (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all font-medium text-sm"
              >
                {t('nav.signIn')}
              </button>

              <button 
                onClick={() => navigate('/register')}
                className="px-5 py-2 bg-[#8B1A2F] text-white rounded-full hover:bg-maroon-dark transition-all font-medium text-sm flex items-center gap-2"
              >
                {t('nav.createAccount')} <span>→</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-500 hover:text-maroon transition-colors bg-gray-50 rounded-full mr-2"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
                    <h4 className="font-bold text-sm text-gray-800 mb-2">{t('nav.recentNotifications')}</h4>
                    <div className="space-y-2">
                      {notifications.length > 0 ? notifications.map((msg, idx) => (
                        <div key={idx} className="p-2 border border-gray-50 bg-gray-50/50 rounded-lg text-xs hover:bg-gray-100 transition-colors">
                          <p className="font-bold text-gray-700 mb-1">{msg.sender?.full_name || 'System'}</p>
                          <p className="text-gray-500 truncate">{msg.content}</p>
                        </div>
                      )) : (
                        <div className="text-xs text-gray-400 p-2 text-center">{t('nav.noNotifications')}</div>
                      )}
                    </div>
                    <button onClick={() => navigate(`/${user.role}`)} className="w-full mt-3 text-xs font-bold text-maroon hover:underline">{t('nav.viewDashboard')}</button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-200 bg-white rounded-full hover:bg-gray-50 transition-all font-medium text-sm"
              >
                <User className="w-4 h-4" /> {t('nav.profile')}
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white text-maroon border border-maroon rounded-full hover:bg-maroon hover:text-white transition-all shadow-sm font-medium text-sm"
              >
                <LogOut className="w-4 h-4" /> {t('nav.logout')}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 flex flex-col gap-4 md:hidden shadow-lg z-50">
          <button onClick={() => scrollToSection('about')} className="px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-700 font-medium text-left">{t('nav.about')}</button>
          <button onClick={() => scrollToSection('how-to-use')} className="px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-700 font-medium text-left">{t('nav.howToUse')}</button>
          <button onClick={() => scrollToSection('benefits')} className="px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-700 font-medium text-left">{t('nav.benefits')}</button>
          <button onClick={() => scrollToSection('access-portal')} className="px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-700 font-medium text-left">{t('nav.accessPortal')}</button>
          
          <div className="border-t border-gray-100 my-2 pt-2 flex flex-col gap-3">
            <div className="flex justify-center gap-4 py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { changeLanguage(lang.code); setIsOpen(false); }}
                  className={`px-3 py-1 text-xs rounded-full border ${currentLang.code === lang.code ? 'bg-[#8B1A2F] text-white border-[#8B1A2F]' : 'text-gray-500 border-gray-200'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {!user ? (
              <>
                <button onClick={() => { setIsOpen(false); navigate('/login'); }} className="w-full py-2 text-center text-gray-700 bg-white border border-gray-300 rounded-full font-medium">{t('nav.signIn')}</button>
                <button onClick={() => { setIsOpen(false); navigate('/register'); }} className="w-full py-2 text-center bg-[#8B1A2F] text-white rounded-full font-medium">{t('nav.createAccount')}</button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsOpen(false); navigate(`/${user.role}`); }} className="w-full py-2 text-center hover:bg-gray-50 border border-gray-300 rounded-full font-medium">{t('nav.dashboard')}</button>
                <button onClick={() => { setIsOpen(false); navigate('/profile'); }} className="w-full py-2 text-center hover:bg-gray-50 border border-gray-300 rounded-full font-medium">{t('nav.profile')}</button>
                <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full py-2 text-center bg-[#8B1A2F] text-white rounded-full font-medium">{t('nav.logout')}</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

