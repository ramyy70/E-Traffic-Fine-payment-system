
const AboutSystem = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="relative">
            <div className="w-full h-80 bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" 
                alt="Digital System" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-maroon rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-skyYellow rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse delay-700"></div>
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Modernizing Traffic Law Enforcement</h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            The E-Traffic Fine System is a comprehensive platform designed to bridge the gap between law enforcement and citizens. By digitizing the fine issuance process, we eliminate paperwork, reduce human error, and guarantee transparency.
          </p>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            For policemen, it's a tool for quick and accurate reporting. For drivers, it's a convenient portal to view, manage, and instantly pay traffic fines via secure gateways or direct QR code scanning from the officer's device.
          </p>
          
          <ul className="space-y-4">
            {['100% Secure & Transparent', 'Instant SMS/App Notifications', 'Multi-gateway Payment Support'].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                <span className="text-gray-800 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSystem;
