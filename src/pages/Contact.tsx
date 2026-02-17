import { Navbar } from '@/components/Navbar';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-20 bg-hero-gradient text-primary-foreground">
        <div className="container-custom mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-sm font-semibold mb-4">
            {t('Contact Us', 'सम्पर्क गर्नुहोस्')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('Get In ', 'सम्पर्कमा ')}<span className="text-gradient">{t('Touch', 'आउनुहोस्')}</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {t("Have questions? We'd love to hear from you. Reach out through any channel below.", 'कुनै प्रश्न छ? हामी तपाईंको सम्पर्कको लागि उत्साहित छौं।')}
          </p>
        </div>
      </div>

      <ContactSection />
      <Footer />
    </main>
  );
};

export default Contact;
