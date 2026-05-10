import { Smartphone, CreditCard, ShieldAlert, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <ShieldAlert className="w-10 h-10 text-maroon" />,
    title: "1. Fine Issuance",
    desc: "A policeman logs an offence in the system instantly."
  },
  {
    icon: <Smartphone className="w-10 h-10 text-maroon" />,
    title: "2. Notification & QR",
    desc: "Driver receives an SMS/App alert with a unique QR code."
  },
  {
    icon: <CreditCard className="w-10 h-10 text-maroon" />,
    title: "3. Quick Payment",
    desc: "Scan the QR or use the payment gateway to settle the fine."
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-maroon" />,
    title: "4. Instant Clearance",
    desc: "Records are updated automatically across the database."
  }
];

const OperationFlow = () => {
  return (
    <section id="flow" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-maroon mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-maroon text-6xl font-black">
                0{index + 1}
              </div>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OperationFlow;
