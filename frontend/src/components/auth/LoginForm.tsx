import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid credentials');

      // Save user session natively for now
      localStorage.setItem('user', JSON.stringify(data.user));

      // Dynamic redirect based on authentic DB role 
      if (data.user.role === 'driver') navigate('/driver');
      else if (data.user.role === 'policeman') navigate('/policeman');
      else if (data.user.role === 'admin') navigate('/admin');
      else navigate('/driver'); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 glass shadow-2xl rounded-3xl border border-white/40">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
           <img src="/src/assets/logo.png" alt="Lanka FinePayments Logo" className="w-24 h-24 object-contain drop-shadow-xl" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('auth.loginTitle')}</h2>
        <p className="text-gray-500 mt-2 font-medium">{t('auth.loginSubtitle')}</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.email')}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon transition-colors bg-white/50 backdrop-blur-sm"
              placeholder={t('auth.emailPlaceholder')}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.password')}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon transition-colors bg-white/50 backdrop-blur-sm"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-maroon focus:ring-maroon mr-2" />
            {t('auth.rememberMe')}
          </label>
          <a href="#" className="text-maroon hover:text-maroon-dark font-medium">{t('auth.forgotPassword')}</a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-maroon hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.signIn')}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
