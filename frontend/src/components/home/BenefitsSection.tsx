import { Building2, Users, HardHat, ShieldCheck, Activity, BarChart4 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BenefitsSection = () => {
  const { t } = useTranslation();

  const benefits = [
    { icon: <Users className="w-8 h-8" />, title: t('benefits.citizens.title'), desc: t('benefits.citizens.desc'), color: "bg-blue-50 text-blue-700 border-blue-100" },
    { icon: <HardHat className="w-8 h-8" />, title: t('benefits.police.title'), desc: t('benefits.police.desc'), color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
    { icon: <Building2 className="w-8 h-8" />, title: t('benefits.gov.title'), desc: t('benefits.gov.desc'), color: "bg-green-50 text-green-700 border-green-100" },
    { icon: <ShieldCheck className="w-8 h-8" />, title: t('benefits.records.title'), desc: t('benefits.records.desc'), color: "bg-purple-50 text-purple-700 border-purple-100" },
    { icon: <Activity className="w-8 h-8" />, title: t('benefits.metrics.title'), desc: t('benefits.metrics.desc'), color: "bg-[#8B1A2F]/10 text-[#8B1A2F] border-[#8B1A2F]/20" },
    { icon: <BarChart4 className="w-8 h-8" />, title: t('benefits.scalable.title'), desc: t('benefits.scalable.desc'), color: "bg-indigo-50 text-indigo-700 border-indigo-100" }
  ];

  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-[#8B1A2F] font-bold tracking-wider uppercase text-sm mb-3 block">{t('benefits.tag')}</span>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">{t('benefits.title')}</h2>
          </div>
          <p className="text-gray-600 max-w-md text-lg">{t('benefits.subtitle')}</p>
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
