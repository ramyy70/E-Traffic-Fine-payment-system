import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Typography & CTAs */}
        <div className="flex-1 max-w-3xl pt-10">
          <div className="mb-8">
            <img src="/src/assets/logo.png" alt="Lanka FinePayments Logo" className="w-28 h-28 object-contain drop-shadow-2xl" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6">
            <ShieldCheck className="w-4 h-4 text-white/90" />
            <span className="text-white/90 text-xs font-bold tracking-wider uppercase">Secure Public-Sector SaaS</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Unified Traffic Fines,<br />
            Complaints, and<br />
            Enforcement<br />
            Operations
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200/90 mb-10 max-w-2xl leading-relaxed">
            A role-based platform built for Drivers, Police Officers, and Admin teams with 
            secure onboarding, audit-ready workflows, and station-linked governance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => document.getElementById('how-to-use')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center px-7 py-3.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
            >
              See Workflow
            </button>
          </div>
        </div>

        {/* Right Side: Glassmorphism Cards */}
        <div className="flex-1 w-full max-w-md lg:max-w-xl flex flex-col gap-6 mt-10 lg:mt-0">
          
          {/* Platform Snapshot Card */}
          <div className="glass-dark bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-white/90 font-bold text-xs tracking-widest uppercase mb-6 drop-shadow-sm">
              Platform Snapshot
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/40 rounded-2xl p-5 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Multi-Role Access</p>
                <p className="text-white font-bold text-3xl">3</p>
              </div>
              <div className="bg-gray-900/40 rounded-2xl p-5 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Core Modules</p>
                <p className="text-white font-bold text-3xl">12+</p>
              </div>
              <div className="bg-gray-900/40 rounded-2xl p-5 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Station Verification</p>
                <p className="text-white font-bold text-2xl">Enabled</p>
              </div>
              <div className="bg-gray-900/40 rounded-2xl p-5 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Audit-Ready</p>
                <p className="text-white font-bold text-2xl">Yes</p>
              </div>
            </div>
          </div>

          {/* Lower Informational Card */}
          <div className="glass-dark bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
            <p className="text-gray-300 text-sm leading-relaxed">
              Built around your schema: <span className="text-white/90">users, drivers, police_officers, admin_users, traffic_fines, fine_payments, fine_appeals, notifications, and audit_logs.</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
