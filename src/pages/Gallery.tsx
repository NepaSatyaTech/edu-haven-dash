import { Navbar } from '@/components/Navbar';
import { GallerySection } from '@/components/GallerySection';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Gallery = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-20" />

      {/* Gallery with Filters & Lightbox */}
      <GallerySection />

      <Footer />
    </main>
  );
};

export default Gallery;
