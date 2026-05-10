import { Building2, Users, HardHat, ShieldCheck, Activity, BarChart4 } from 'lucide-react';

const benefits = [
  { icon: <Users className="w-8 h-8" />, title: "For Citizens", desc: "No more standing in queues. View past history, settle new fines from your couch, and eliminate paperwork.", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { icon: <HardHat className="w-8 h-8" />, title: "For Police Officers", desc: "Rapid verification of licenses via national databases, instant digital ticketing, built-in geographic tagging.", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  { icon: <Building2 className="w-8 h-8" />, title: "For Government", desc: "Complete oversight, revenue tracking, geographical heatmaps of traffic incidents, and transparent auditing.", color: "bg-green-50 text-green-700 border-green-100" },
  { icon: <ShieldCheck className="w-8 h-8" />, title: "Immutable Records", desc: "Every transaction and fine lifecycle is permanently logged preventing any tampering or unauthorized dismissals.", color: "bg-purple-50 text-purple-700 border-purple-100" },
  { icon: <Activity className="w-8 h-8" />, title: "Real-time Metrics", desc: "Live dashboards indicating active offenses, settlement rates, and department performance.", color: "bg-[#8B1A2F]/10 text-[#8B1A2F] border-[#8B1A2F]/20" },
  { icon: <BarChart4 className="w-8 h-8" />, title: "Scalable Infrastructure", desc: "Built as a modular SaaS platform ready to integrate with upcoming smart city and CCTV initiatives.", color: "bg-indigo-50 text-indigo-700 border-indigo-100" }
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-[#8B1A2F] font-bold tracking-wider uppercase text-sm mb-3 block">System Advantages</span>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">Delivering Value Across the Entire Ecosystem</h2>
          </div>
          <p className="text-gray-600 max-w-md text-lg">Designed specifically to resolve friction points encountered by everyday users and command levels alike.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 border ${benefit.color}`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
