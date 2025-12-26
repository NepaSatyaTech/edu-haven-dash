import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  category: string;
  is_published: boolean;
}

export const GallerySection = () => {
  const { t } = useLanguage();

  const categoryMap: Record<string, string> = {
    'All': t('All', 'सबै'),
    'Campus': t('Campus', 'क्याम्पस'),
    'Events': t('Events', 'कार्यक्रम'),
    'Sports': t('Sports', 'खेलकुद'),
    'Academic': t('Academic', 'शैक्षिक'),
    'Cultural': t('Cultural', 'सांस्कृतिक'),
    'General': t('General', 'सामान्य'),
  };

  const categories = ['All', 'Campus', 'Events', 'Sports', 'Academic', 'Cultural', 'General'];

  const { data: galleryImages = [] } = useQuery({
    queryKey: ['gallery-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const currentIndex =
    selectedImage !== null
      ? filteredImages.findIndex((img) => img.id === selectedImage)
      : -1;

  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;
    const newIndex =
      direction === 'prev'
        ? (currentIndex - 1 + filteredImages.length) % filteredImages.length
        : (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[newIndex].id);
  };

  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-green-400 to-green-600',
    'from-amber-400 to-amber-600',
    'from-pink-400 to-pink-600',
    'from-teal-400 to-teal-600',
    'from-orange-400 to-orange-600',
    'from-red-400 to-red-600',
  ];

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-4">
            {t('Gallery', 'ग्यालेरी')}
          </span>
          <h2 className="section-title">
            {t('Campus Life in Pictures', 'तस्वीरमा क्याम्पस जीवन')}
          </h2>
          <p className="section-subtitle">
            {t(
              'Explore moments from our vibrant school life through our photo gallery.',
              'हाम्रो विद्यालय जीवनका सुन्दर क्षणहरू तस्बिरमार्फत अवलोकन गर्नुहोस्।'
            )}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {categoryMap[category] || category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t('No images available yet.', 'अहिलेसम्म कुनै तस्वीर उपलब्ध छैन।')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image.id)}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              >
                {image.image_url ? (
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors[index % colors.length]}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-display font-bold text-white/80">
                        {image.title.charAt(0)}
                      </span>
                    </div>
                  </>
                )}

                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <ZoomIn className="w-8 h-8 text-white mb-2" />
                  <p className="text-white font-semibold text-center text-sm">
                    {image.title}
                  </p>
                  <span className="text-white/70 text-xs mt-1">
                    {categoryMap[image.category] || image.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-card/20 flex items-center justify-center text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 w-12 h-12 rounded-full bg-card/20 flex items-center justify-center text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 w-12 h-12 rounded-full bg-card/20 flex items-center justify-center text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full aspect-video rounded-2xl overflow-hidden">
              {filteredImages.map(
                (image) =>
                  image.id === selectedImage && (
                    <div key={image.id} className="w-full h-full relative">
                      {image.image_url ? (
                        <>
                          <img
                            src={image.image_url}
                            alt={image.title}
                            className="w-full h-full object-contain bg-black"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-xl font-display font-bold text-white">
                              {image.title}
                            </h3>
                            <p className="text-white/70">
                              {categoryMap[image.category] || image.category}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${colors[0]} flex items-center justify-center`}>
                          <div className="text-center text-white">
                            <h3 className="text-2xl font-display font-bold">
                              {image.title}
                            </h3>
                            <p className="text-white/70">
                              {categoryMap[image.category] || image.category}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};