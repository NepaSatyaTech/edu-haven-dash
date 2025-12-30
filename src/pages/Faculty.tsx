import { Navbar } from '@/components/Navbar';
import { FacultySection } from '@/components/FacultySection';
import { Footer } from '@/components/Footer';

const Faculty = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <FacultySection />
      </div>
      <Footer />
    </main>
  );
};

export default Faculty;
