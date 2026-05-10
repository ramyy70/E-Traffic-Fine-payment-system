import Navbar from '../components/common/Navbar';
import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center bg-no-repeat bg-fixed">
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10">
        <Navbar />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full flex justify-center flex-col items-center">
          <LoginForm />
          <p className="mt-8 text-center text-white/80 font-medium drop-shadow-md">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-400 font-bold hover:text-yellow-300 hover:underline transition-all">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
