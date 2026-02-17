import { Navbar } from '@/components/Navbar';
import { GallerySection } from '@/components/GallerySection';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Gallery = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-20 bg-hero-gradient text-primary-foreground">
        <div className="container-custom mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-sm font-semibold mb-4">
            {t('Gallery', 'ग्यालेरी')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('Campus Life in ', 'क्याम्पस जीवन ')}<span className="text-gradient">{t('Pictures', 'तस्बिरहरूमा')}</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {t('Explore moments from our vibrant school life — events, sports, culture, and more.', 'हाम्रो जीवन्त विद्यालय जीवनका क्षणहरू अन्वेषण गर्नुहोस् — कार्यक्रम, खेलकुद, संस्कृति, र अझ बढी।')}
          </p>
        </div>
      </div>

      {/* Gallery with Filters & Lightbox */}
      <GallerySection />

      <Footer />
    </main>
  );
};

export default Gallery;
