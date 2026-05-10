import { Smartphone, BellRing, CreditCard, FileCheck2 } from 'lucide-react';

const steps = [
  { icon: <Smartphone className="w-8 h-8" />, title: "Record Offence", desc: "Officer enters details via secure mobile portal." },
  { icon: <BellRing className="w-8 h-8" />, title: "Real-time Alert", desc: "Driver instantly receives SMS & app notification." },
  { icon: <CreditCard className="w-8 h-8" />, title: "Settle Fine", desc: "Securely pay online via card or designated banks." },
  { icon: <FileCheck2 className="w-8 h-8" />, title: "Record Cleared", desc: "Digital driving profile is updated automatically." }
];

const HowToUseSection = () => {
  return (
    <section id="how-to-use" className="py-24 bg-gray-50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#8B1A2F] font-bold tracking-wider uppercase text-sm mb-3 block">Operational Workflow</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How the Platform Works</h2>
          <p className="text-lg text-gray-600">A seamless four-step architectural flow that guarantees zero downtime between citation issuance and resolution.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-0.5 bg-gray-200 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center text-[#8B1A2F] mb-6 group-hover:-translate-y-2 transition-transform duration-300 relative">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 text-white font-bold rounded-full flex items-center justify-center border-4 border-gray-50 shadow-sm text-sm">
                  {index + 1}
                </span>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed px-4">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection;
