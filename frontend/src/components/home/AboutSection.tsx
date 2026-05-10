import { Target, Shield, Zap } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-50 to-blue-50 rounded-3xl transform -rotate-3"></div>
            <img 
              src="https://img.freepik.com/premium-photo/smart-city-traffic-management-system-displayed_976492-129382.jpg?w=2000" 
              alt="Digital Traffic Architecture" 
              className="relative rounded-2xl shadow-xl w-full object-cover h-[500px]"
            />
            <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-2xl max-w-xs border border-gray-100 hidden md:block">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-red-50 text-[#8B1A2F] rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 leading-tight">Digital Transition</h4>
              </div>
              <p className="text-sm text-gray-600">Replacing manual ticketing with a centralized, immutable cloud architecture.</p>
            </div>
          </div>
          
          <div className="flex-1 mt-10 md:mt-0">
            <span className="text-[#8B1A2F] font-bold tracking-wider uppercase text-sm mb-3 block">About The Initiative</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">Transforming National Traffic Governance</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              The E-Traffic SAAS platform is a government-backed initiative designed to modernize the enforcement, tracking, and settlement of traffic violations nationwide. By bridging the gap between field officers, administrative bodies, and citizens, we ensure absolute transparency and efficiency.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: <Target className="w-5 h-5 text-[#8B1A2F]" />, title: 'Accuracy & Accountability', desc: 'Real-time syncing from officer devices heavily reduces human error and manipulation.' },
                { icon: <Zap className="w-5 h-5 text-[#8B1A2F]" />, title: 'Instantaneous Processing', desc: 'Fines are logged, citizens are notified, and gateways are prepared in milliseconds.' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-gray-50 rounded-lg border border-gray-100">{feature.icon}</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
