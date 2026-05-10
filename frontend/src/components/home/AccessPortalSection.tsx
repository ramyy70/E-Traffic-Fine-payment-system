import { Car, ShieldCheck, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessPortalSection = () => {
  const navigate = useNavigate();

  return (
    <section id="access-portal" className="relative py-32 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop" 
          alt="Night City Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-[#1f425b]/80 to-[#7a1329]/90 mix-blend-overlay"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase mb-4 border border-white/20">Secure Entry</span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Choose Your Access Portal</h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-16">Select your role to access the dedicated dashboard built specifically for your operational needs.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/15 transition-all duration-300 text-left shadow-2xl">
            <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-2xl flex items-center justify-center mb-6">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Citizens & Drivers</h3>
            <p className="text-gray-300 mb-8 h-20">Access your driving history, active violations, and seamless payment gateways.</p>
            <button onClick={() => navigate('/login')} className="w-full py-3.5 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors">
              Citizen Login
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/15 transition-all duration-300 text-left shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-[#8B1A2F] text-xs font-bold text-white rounded-bl-2xl tracking-wider">RESTRICTED</div>
            <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Police Officers</h3>
            <p className="text-gray-300 mb-8 h-20">Department personnel portal for validating identities and issuing digital fines.</p>
            <button onClick={() => navigate('/login')} className="w-full py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
              Officer Login
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/15 transition-all duration-300 text-left shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 bg-gray-600/80 text-xs font-bold text-white rounded-bl-2xl tracking-wider">ADMIN ONLY</div>
            <div className="w-16 h-16 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-2xl flex items-center justify-center mb-6">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">System Admins</h3>
            <p className="text-gray-300 mb-8 h-20">Governance, station directory management, and statistical overview command center.</p>
            <button onClick={() => navigate('/login')} className="w-full py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
              Admin Login
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AccessPortalSection;
