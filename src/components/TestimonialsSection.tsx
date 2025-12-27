import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const TestimonialsSection = () => {
  const { language, t } = useLanguage();
  const { data: settings } = useSiteSettings();

  const getSettingValue = (key: string) => {
    if (!settings?.[key]) return '';
    return language === 'ne' && settings[key].value_ne 
      ? settings[key].value_ne 
      : settings[key].value_en;
  };

  // Fetch testimonials from database
  const { data: testimonials = [] } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const gradientColors = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-rose-500 to-rose-600',
    'from-cyan-500 to-cyan-600',
  ];

  const stats = [
    { value: '98%', label: t('Parent Satisfaction', 'अभिभावक सन्तुष्टि') },
    { value: '4.9/5', label: t('Google Rating', 'गुगल रेटिङ') },
    { value: '95%', label: t('Alumni Recommend', 'पूर्व विद्यार्थी सिफारिस') },
    { value: '500+', label: t('Reviews', 'समीक्षाहरू') },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {t('Testimonials', 'प्रशंसापत्र')}
          </span>
          <h2 className="section-title">
            {getSettingValue('testimonials_title') || t('What Our Community Says', 'हाम्रो समुदायले के भन्छ')}
          </h2>
          <p className="section-subtitle">
            {getSettingValue('testimonials_description') || t(
              "Hear from parents, students, and alumni about their experience at Lautan Ram Dropadi Devi.",
              "अभिभावक, विद्यार्थी, र पूर्व विद्यार्थीहरूले लौटन राम द्रोपदी देवीमा आफ्नो अनुभवबारे के भन्छन् सुन्नुहोस्।"
            )}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              {t('No testimonials yet.', 'अहिलेसम्म कुनै प्रशंसापत्र छैन।')}
            </div>
          ) : (
            testimonials.map((testimonial, index) => {
              const content = language === 'ne' && testimonial.content_ne 
                ? testimonial.content_ne 
                : testimonial.content_en;
              const role = language === 'ne' && testimonial.role_ne 
                ? testimonial.role_ne 
                : testimonial.role_en;
              const gradientColor = gradientColors[index % gradientColors.length];

              return (
                <div
                  key={testimonial.id}
                  className="group glass-card p-8 hover:shadow-card-hover transition-all duration-500"
                >
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <Quote className="w-10 h-10 text-secondary/50" />
                  </div>

                  {/* Content */}
                  <p className="text-foreground text-lg leading-relaxed mb-6 italic">
                    "{content}"
                  </p>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
                    >
                      <span className="text-lg font-display font-bold text-white">
                        {testimonial.initials || testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};