import Navbar from '../components/common/Navbar';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import HowToUseSection from '../components/home/HowToUseSection';
import BenefitsSection from '../components/home/BenefitsSection';
import AccessPortalSection from '../components/home/AccessPortalSection';
import Footer from '../components/common/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <div>
        <HeroSection />
        <AboutSection />
        <HowToUseSection />
        <BenefitsSection />
        <AccessPortalSection />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
