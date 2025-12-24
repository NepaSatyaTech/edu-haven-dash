import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { AcademicsSection } from '@/components/AcademicsSection';
import { FacilitiesSection } from '@/components/FacilitiesSection';
import { FacultySection } from '@/components/FacultySection';
import { AdmissionsSection } from '@/components/AdmissionsSection';
import { NoticesSection } from '@/components/NoticesSection';
import { GallerySection } from '@/components/GallerySection';
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
      <FacultySection />
      <AdmissionsSection />
      <NoticesSection />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
