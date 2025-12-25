import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const GallerySection = () => {
  const { t } = useLanguage();

  const categories = [
    t('All', 'सबै'),
    t('Campus', 'क्याम्पस'),
    t('Events', 'कार्यक्रम'),
    t('Sports', 'खेलकुद'),
    t('Academic', 'शैक्षिक'),
    t('Cultural', 'सांस्कृतिक'),
  ];

  const galleryImages = [
    {
      id: 1,
      category: t('Campus', 'क्याम्पस'),
      title: t('Main Building', 'मुख्य भवन'),
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 2,
      category: t('Events', 'कार्यक्रम'),
      title: t('Annual Day 2082', 'वार्षिकोत्सव २०८२'),
      color: 'from-purple-400 to-purple-600',
    },
    {
      id: 3,
      category: t('Sports', 'खेलकुद'),
      title: t('Sports Day', 'खेलकुद दिवस'),
      color: 'from-green-400 to-green-600',
    },
    {
      id: 4,
      category: t('Academic', 'शैक्षिक'),
      title: t('Science Lab', 'विज्ञान प्रयोगशाला'),
      color: 'from-amber-400 to-amber-600',
    },
    {
      id: 5,
      category: t('Cultural', 'सांस्कृतिक'),
      title: t('Dance Performance', 'नृत्य प्रस्तुति'),
      color: 'from-pink-400 to-pink-600',
    },
    {
      id: 6,
      category: t('Campus', 'क्याम्पस'),
      title: t('Library', 'पुस्तकालय'),
      color: 'from-teal-400 to-teal-600',
    },
    {
      id: 7,
      category: t('Events', 'कार्यक्रम'),
      title: t('National Unity Day', 'राष्ट्रिय एकता दिवस'),
      color: 'from-orange-400 to-orange-600',
    },
    {
      id: 8,
      category: t('Sports', 'खेलकुद'),
      title: t('Cricket Match', 'क्रिकेट प्रतियोगिता'),
      color: 'from-red-400 to-red-600',
    },
    {
      id: 9,
      category: t('Academic', 'शैक्षिक'),
      title: t('Computer Lab', 'कम्प्युटर प्रयोगशाला'),
      color: 'from-indigo-400 to-indigo-600',
    },
    {
      id: 10,
      category: t('Cultural', 'सांस्कृतिक'),
      title: t('Music Concert', 'सांगीतिक कार्यक्रम'),
      color: 'from-rose-400 to-rose-600',
    },
    {
      id: 11,
      category: t('Campus', 'क्याम्पस'),
      title: t('Playground', 'खेल मैदान'),
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      id: 12,
      category: t('Events', 'कार्यक्रम'),
      title: t('Graduation Day', 'दीक्षान्त समारोह'),
      color: 'from-violet-400 to-violet-600',
    },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages =
    activeCategory === t('All', 'सबै')
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
        ? (currentIndex - 1 + filteredImages.length) %
          filteredImages.length
        : (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[newIndex].id);
  };

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
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${image.color}`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-white/80">
                  {image.title.charAt(0)}
                </span>
              </div>

              <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                <ZoomIn className="w-8 h-8 text-white mb-2" />
                <p className="text-white font-semibold text-center text-sm">
                  {image.title}
                </p>
                <span className="text-white/70 text-xs mt-1">
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-card/20 flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 w-12 h-12 rounded-full bg-card/20 flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 w-12 h-12 rounded-full bg-card/20 flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full aspect-video rounded-2xl overflow-hidden">
              {filteredImages.map(
                (image) =>
                  image.id === selectedImage && (
                    <div
                      key={image.id}
                      className={`w-full h-full bg-gradient-to-br ${image.color} flex items-center justify-center`}
                    >
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-display font-bold">
                          {image.title}
                        </h3>
                        <p className="text-white/70">{image.category}</p>
                      </div>
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
