import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const categories = ['All', 'Campus', 'Events', 'Sports', 'Academic', 'Cultural'];

const galleryImages = [
  { id: 1, category: 'Campus', title: 'Main Building', color: 'from-blue-400 to-blue-600' },
  { id: 2, category: 'Events', title: 'Annual Day 2024', color: 'from-purple-400 to-purple-600' },
  { id: 3, category: 'Sports', title: 'Sports Day', color: 'from-green-400 to-green-600' },
  { id: 4, category: 'Academic', title: 'Science Lab', color: 'from-amber-400 to-amber-600' },
  { id: 5, category: 'Cultural', title: 'Dance Performance', color: 'from-pink-400 to-pink-600' },
  { id: 6, category: 'Campus', title: 'Library', color: 'from-teal-400 to-teal-600' },
  { id: 7, category: 'Events', title: 'Independence Day', color: 'from-orange-400 to-orange-600' },
  { id: 8, category: 'Sports', title: 'Cricket Match', color: 'from-red-400 to-red-600' },
  { id: 9, category: 'Academic', title: 'Computer Lab', color: 'from-indigo-400 to-indigo-600' },
  { id: 10, category: 'Cultural', title: 'Music Concert', color: 'from-rose-400 to-rose-600' },
  { id: 11, category: 'Campus', title: 'Playground', color: 'from-emerald-400 to-emerald-600' },
  { id: 12, category: 'Events', title: 'Graduation Day', color: 'from-violet-400 to-violet-600' },
];

export const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const currentIndex = selectedImage !== null 
    ? filteredImages.findIndex(img => img.id === selectedImage)
    : -1;

  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredImages.length) % filteredImages.length
      : (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[newIndex].id);
  };

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-4">
            Gallery
          </span>
          <h2 className="section-title">Campus Life in Pictures</h2>
          <p className="section-subtitle">
            Explore moments from our vibrant school life through our photo gallery.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image.id)}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${image.color}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-white/80">
                  {image.title.charAt(0)}
                </span>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                <ZoomIn className="w-8 h-8 text-white mb-2" />
                <p className="text-white font-semibold text-center text-sm">
                  {image.title}
                </p>
                <span className="text-white/70 text-xs mt-1">{image.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-card/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-card/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-card/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Display */}
            <div className="max-w-4xl w-full aspect-video rounded-2xl overflow-hidden">
              {filteredImages.map((image) =>
                image.id === selectedImage ? (
                  <div
                    key={image.id}
                    className={`w-full h-full bg-gradient-to-br ${image.color} flex items-center justify-center`}
                  >
                    <div className="text-center text-white">
                      <span className="text-8xl font-display font-bold opacity-50">
                        {image.title.charAt(0)}
                      </span>
                      <h3 className="text-2xl font-display font-bold mt-4">
                        {image.title}
                      </h3>
                      <p className="text-white/70">{image.category}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
