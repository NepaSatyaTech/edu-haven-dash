import { Navbar } from '@/components/Navbar';
import { GallerySection } from '@/components/GallerySection';
import { Footer } from '@/components/Footer';

const Gallery = () => (
  <main className="min-h-screen">
    <Navbar />
    <div className="pt-20">
      <GallerySection />
    </div>
    <Footer />
  </main>
);

export default Gallery;
