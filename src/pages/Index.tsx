import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { FacilitiesSection } from '@/components/FacilitiesSection';
import { AdmissionsSection } from '@/components/AdmissionsSection';
import { NoticesSection } from '@/components/NoticesSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* SEO Meta Tags handled by index.html */}
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FacilitiesSection />
      <AdmissionsSection />
      <NoticesSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
};

export default Index;
