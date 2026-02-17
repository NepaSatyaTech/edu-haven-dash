import { Navbar } from '@/components/Navbar';
import { AdmissionsSection } from '@/components/AdmissionsSection';
import { Footer } from '@/components/Footer';

const Admissions = () => (
  <main className="min-h-screen">
    <Navbar />
    <div className="pt-20">
      <AdmissionsSection />
    </div>
    <Footer />
  </main>
);

export default Admissions;
