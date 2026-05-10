import { ShieldAlert, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-ash px-4 py-16 border-t font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 font-bold text-2xl mb-4">
            <img src="/src/assets/logo.png" alt="Lanka FinePayments Logo" className="w-12 h-12 object-contain" />
            <span className="text-white tracking-tight">Lanka FinePayments</span>
          </div>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Revolutionizing road safety and fine management through digital transparency and efficiency.
          </p>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-skyYellow transition-colors flex items-center justify-center w-8 h-8 rounded-full bg-gray-800">FB</a>
            <a href="#" className="hover:text-skyYellow transition-colors flex items-center justify-center w-8 h-8 rounded-full bg-gray-800">X</a>
            <a href="#" className="hover:text-skyYellow transition-colors flex items-center justify-center w-8 h-8 rounded-full bg-gray-800">IG</a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#flow" className="hover:text-white transition-colors">How it Works</a></li>
            <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Legal</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-maroon mt-1" />
              <span className="text-gray-400">Traffic Headquarters,<br/>Colombo, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-maroon" />
              <span className="text-gray-400">+94 11 234 5678</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-maroon" />
              <span className="text-gray-400">support@etraffic.lk</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Lanka FinePayments. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
