import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { AcademicsSection } from '@/components/AcademicsSection';
import { FacilitiesSection } from '@/components/FacilitiesSection';
import { AdmissionsSection } from '@/components/AdmissionsSection';
import { FacultySection } from '@/components/FacultySection';
import { GallerySection } from '@/components/GallerySection';
import { NoticesSection } from '@/components/NoticesSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* SEO Meta Tags handled by index.html */}
      <Navbar />
      <HeroSection />
      <AboutSection />
      <AcademicsSection />
      <FacilitiesSection />
      <AdmissionsSection />
      <FacultySection />
      <GallerySection />
      <NoticesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
