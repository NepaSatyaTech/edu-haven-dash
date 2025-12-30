import { Navbar } from '@/components/Navbar';
import { AcademicsSection } from '@/components/AcademicsSection';
import { Footer } from '@/components/Footer';

const Academics = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <AcademicsSection />
      </div>
      <Footer />
    </main>
  );
};

export default Academics;
