import { Navbar } from '@/components/Navbar';
import { NoticesSection } from '@/components/NoticesSection';
import { Footer } from '@/components/Footer';

const Notices = () => (
  <main className="min-h-screen">
    <Navbar />
    <div className="pt-20">
      <NoticesSection />
    </div>
    <Footer />
  </main>
);

export default Notices;
