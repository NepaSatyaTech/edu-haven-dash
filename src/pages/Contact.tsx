import { Navbar } from '@/components/Navbar';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-20" />

      <ContactSection />
      <Footer />
    </main>
  );
};

export default Contact;
