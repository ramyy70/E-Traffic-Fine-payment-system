import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authHelpers } from '../lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('driver'); // 'driver', 'police', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const result = await authHelpers.signin(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Get user profile to verify role
      const userProfile = await authHelpers.getUserProfile(result.user.id);

      if (!userProfile) {
        setError('User profile not found');
        setLoading(false);
        return;
      }

      // Verify user type matches the selected tab
      if (userProfile.user_type !== activeTab) {
        setError(`This account is registered as a ${userProfile.user_type}, not a ${activeTab}`);
        setLoading(false);
        return;
      }

      setSuccess(`Welcome, ${userProfile.full_name}!`);

      // Redirect based on role
      setTimeout(() => {
        switch (userProfile.user_type) {
          case 'driver':
            navigate('/driver/dashboard');
            break;
          case 'police':
            navigate('/police/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }, 1000);
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 mb-4">
            <ArrowRight className="h-6 w-6 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Traffic Management</h1>
          <p className="text-slate-400">Sri Lanka Motor Traffic Authority</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Role Tabs */}
          <div className="flex gap-2 mb-6 bg-slate-900/50 p-1 rounded-lg">
            {[
              { id: 'driver', label: 'Driver', icon: '🚗' },
              { id: 'police', label: 'Police', icon: '👮' },
              { id: 'admin', label: 'Admin', icon: '⚙️' },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setActiveTab(role.id);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 px-3 rounded-lg transition font-semibold text-sm flex items-center justify-center gap-2 ${
                  activeTab === role.id
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <span>{role.icon}</span>
                {role.label}
              </button>
            ))}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-200">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30 transition disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30 transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input type="checkbox" className="rounded" disabled={loading} />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-slate-400 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-xs mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
