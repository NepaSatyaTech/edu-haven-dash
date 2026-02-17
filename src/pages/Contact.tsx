import { Navbar } from '@/components/Navbar';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Contact = () => (
  <main className="min-h-screen">
    <Navbar />
    <div className="pt-20">
      <ContactSection />
    </div>
    <Footer />
  </main>
);

export default Contact;
