import { Navbar } from '@/components/Navbar';
import { FacilitiesSection } from '@/components/FacilitiesSection';
import { Footer } from '@/components/Footer';

const Facilities = () => (
  <main className="min-h-screen">
    <Navbar />
    <div className="pt-20">
      <FacilitiesSection />
    </div>
    <Footer />
  </main>
);

export default Facilities;
