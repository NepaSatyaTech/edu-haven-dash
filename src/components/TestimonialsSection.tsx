import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext'; // Assumes a language context

export const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: 'Mrs. Sunita Kapoor',
      role: t('Parent of Grade 8 Student', 'ग्रेड ८ विद्यार्थीको अभिभावक'),
      content: t(
        "Lautan Ram Dropadi Devi has transformed my daughter's approach to learning. The teachers are incredibly supportive, and the holistic development focus is remarkable.",
        "लौटन राम द्रोपदी देवीले मेरी छोरीको सिकाइको दृष्टिकोण परिवर्तन गर्‍यो। शिक्षकहरू अत्यन्तै सहयोगी छन्, र समग्र विकासमा केन्द्रित दृष्टिकोण प्रशंसनीय छ।"
      ),
      rating: 5,
      initials: 'SK',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Rahul Sharma',
      role: t('Alumni, Batch of 2020', 'पूर्व विद्यार्थी, २०२० ब्याच'),
      content: t(
        "The foundation I received here helped me crack JEE Advanced. The faculty's dedication and the competitive environment prepared me well for success.",
        "यहाँ पाएको आधारले मलाई JEE Advanced मा सफलता हासिल गर्न मद्दत गर्‍यो। शिक्षकहरूको समर्पण र प्रतिस्पर्धात्मक वातावरणले मलाई सफलताका लागि तयार पारे।"
      ),
      rating: 5,
      initials: 'RS',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      name: 'Mr. Amit Patel',
      role: t('Parent of Grade 5 & Grade 9 Students', 'ग्रेड ५ र ग्रेड ९ विद्यार्थीको अभिभावक'),
      content: t(
        'Both my children study here and the difference in their confidence and knowledge is visible. The school truly cares about each student.',
        'मेरो दुबै बच्चा यहाँ पढ्छन् र उनीहरूको आत्मविश्वास र ज्ञानमा स्पष्ट फरक देखिन्छ। स्कूल साँच्चिकै प्रत्येक विद्यार्थीको ख्याल राख्छ।'
      ),
      rating: 5,
      initials: 'AP',
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'Priya Agarwal',
      role: t('Alumni, Batch of 2019', 'पूर्व विद्यार्थी, २०१९ ब्याच'),
      content: t(
        "The extracurricular activities and sports programs helped me discover my passion. I'm now pursuing professional athletics thanks to the exposure I got here.",
        "पाठ्येतर गतिविधिहरू र खेलकुद कार्यक्रमहरूले मलाई मेरो रुचि पत्ता लगाउन मद्दत गर्‍यो। यहाँको अनुभवका कारण म अहिले पेशेवर खेलकुदमा लागिरहेको छु।"
      ),
      rating: 5,
      initials: 'PA',
      color: 'from-orange-500 to-orange-600',
    },
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
          <h2 className="section-title">{t('What Our Community Says', 'हाम्रो समुदायले के भन्छ')}</h2>
          <p className="section-subtitle">
            {t(
              "Hear from parents, students, and alumni about their experience at Lautan Ram Dropadi Devi.",
              "अभिभावक, विद्यार्थी, र पूर्व विद्यार्थीहरूले लौटन राम द्रोपदी देवीमा आफ्नो अनुभवबारे के भन्छन् सुन्नुहोस्।"
            )}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group glass-card p-8 hover:shadow-card-hover transition-all duration-500"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-10 h-10 text-secondary/50" />
              </div>

              {/* Content */}
              <p className="text-foreground text-lg leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center`}
                >
                  <span className="text-lg font-display font-bold text-white">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
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
