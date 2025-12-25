import { Target, Eye, Heart, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const AboutSection = () => {
  const { language, t } = useLanguage();
  const { data: settings } = useSiteSettings();

  const getSettingValue = (key: string) => {
    if (!settings?.[key]) return '';
    return language === 'ne' && settings[key].value_ne 
      ? settings[key].value_ne 
      : settings[key].value_en;
  };

  const schoolImageUrl = settings?.['school_image_url']?.value_en;
  const headteacherImageUrl = settings?.['headteacher_image_url']?.value_en;

  const features = [
    t('State-of-the-art infrastructure and smart classrooms', 'आधुनिक पूर्वाधार र स्मार्ट कक्षाकोठाहरू'),
    t('Experienced faculty with international training', 'अन्तर्राष्ट्रिय तालिम प्राप्त अनुभवी शिक्षकहरू'),
    t('Focus on STEM education and digital literacy', 'STEM शिक्षा र डिजिटल साक्षरतामा केन्द्रित'),
    t('Strong emphasis on sports, arts, and extracurriculars', 'खेलकुद, कला, र पाठ्येतर गतिविधिहरूमा जोड'),
    t('Regular parent-teacher collaboration programs', 'नियमित अभिभावक-शिक्षक सहकार्य कार्यक्रमहरू'),
  ];

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {t('About Us', 'हाम्रो बारेमा')}
          </span>
          <h2 className="section-title">{getSettingValue('about_title') || t('A Legacy of Excellence', 'उत्कृष्टताको विरासत')}</h2>
          <p className="section-subtitle">
            {getSettingValue('about_description') || t(
              'For over five decades, Lautan Ram Dropadi Devi has been at the forefront of educational excellence, nurturing generations of successful leaders.',
              'पाँच दशकभन्दा बढी समयदेखि, लोटन राम द्रौपदी देवी शैक्षिक उत्कृष्टताको अग्रणीमा रहेको छ।'
            )}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Left - Image/Visual */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden shadow-elevated">
              {schoolImageUrl ? (
                <img 
                  src={schoolImageUrl} 
                  alt={t('School Building', 'विद्यालय भवन')}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-12 h-12 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                      {t('Est.', 'स्थापना')} {getSettingValue('school_established') || '1974'}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('50 Years of Educational Excellence', '५० वर्षको शैक्षिक उत्कृष्टता')}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 glass-card p-6 max-w-xs animate-float">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-secondary">A+</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">{t('NEB Accredited', 'NEB मान्यता प्राप्त')}</p>
                  <p className="text-sm text-muted-foreground">{t('Top-rated Institution', 'शीर्ष मूल्याङ्कन संस्था')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Text Content */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              {t('Where Learning Meets', 'जहाँ सिकाइ भेट्छ')}{' '}
              <span className="text-gradient">{t('Innovation', 'नवीनता')}</span>
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t(
                'Lautan Ram Dropadi Devi stands as a beacon of academic excellence and holistic development. Our institution combines time-tested educational methodologies with cutting-edge technology to prepare students for the challenges of tomorrow.',
                'लोटन राम द्रौपदी देवी शैक्षिक उत्कृष्टता र समग्र विकासको प्रतीकको रूपमा खडा छ। हाम्रो संस्थाले समय-परीक्षित शैक्षिक विधिहरूलाई आधुनिक प्रविधिसँग मिलाएर विद्यार्थीहरूलाई भोलिका चुनौतीहरूको लागि तयार पार्छ।'
              )}
            </p>
            
            {/* Features List */}
            <ul className="space-y-3">
              {features.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vision, Mission, Values Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Eye,
              title: t('Our Vision', 'हाम्रो दृष्टि'),
              description: t(
                'To be a globally recognized institution that shapes responsible citizens and innovative leaders who contribute positively to society.',
                'समाजमा सकारात्मक योगदान गर्ने जिम्मेवार नागरिक र नवीन नेताहरू तयार गर्ने विश्वव्यापी मान्यता प्राप्त संस्था बन्नु।'
              ),
              color: 'primary',
            },
            {
              icon: Target,
              title: t('Our Mission', 'हाम्रो मिशन'),
              description: t(
                'To provide comprehensive education that develops intellectual, physical, and moral excellence while fostering creativity and critical thinking.',
                'बौद्धिक, शारीरिक, र नैतिक उत्कृष्टता विकास गर्ने व्यापक शिक्षा प्रदान गर्नु जसले सिर्जनशीलता र समालोचनात्मक सोचलाई बढावा दिन्छ।'
              ),
              color: 'secondary',
            },
            {
              icon: Heart,
              title: t('Our Values', 'हाम्रो मूल्यहरू'),
              description: t(
                'Integrity, Excellence, Compassion, Innovation, and Respect form the pillars of our educational philosophy and institutional culture.',
                'इमानदारी, उत्कृष्टता, करुणा, नवीनता, र सम्मान हाम्रो शैक्षिक दर्शन र संस्थागत संस्कृतिका स्तम्भ हुन्।'
              ),
              color: 'accent',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group glass-card p-8 hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
                  card.color === 'primary'
                    ? 'bg-primary/10'
                    : card.color === 'secondary'
                    ? 'bg-secondary/20'
                    : 'bg-accent/10'
                }`}
              >
                <card.icon
                  className={`w-7 h-7 ${
                    card.color === 'primary'
                      ? 'text-primary'
                      : card.color === 'secondary'
                      ? 'text-secondary'
                      : 'text-accent'
                  }`}
                />
              </div>
              <h4 className="text-xl font-display font-bold text-foreground mb-3">
                {card.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Principal's Message */}
        <div className="mt-20 glass-card p-8 md:p-12 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="grid md:grid-cols-[auto,1fr] gap-8 items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto md:mx-0 overflow-hidden">
              {headteacherImageUrl ? (
                <img 
                  src={headteacherImageUrl} 
                  alt={getSettingValue('headteacher_name') || t('Principal', 'प्रधानाध्यापक')}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-display font-bold text-primary-foreground">
                  {(getSettingValue('headteacher_name') || 'DR').split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <blockquote className="text-lg md:text-xl text-foreground italic leading-relaxed mb-4">
                "{getSettingValue('headteacher_message') || t(
                  'Education is not just about acquiring knowledge; it\'s about developing character, fostering curiosity, and preparing young minds to face life\'s challenges with confidence and integrity.',
                  'शिक्षा केवल ज्ञान प्राप्त गर्ने बारेमा मात्र होइन; यो चरित्र विकास, जिज्ञासा बढाउने, र आत्मविश्वास र इमानदारीका साथ जीवनका चुनौतीहरूको सामना गर्न युवा मनहरूलाई तयार पार्ने बारेमा हो।'
                )}"
              </blockquote>
              <div>
                <p className="font-display font-bold text-foreground">
                  {getSettingValue('headteacher_name') || t('Dr. Rajesh Kumar', 'डा. राजेश कुमार')}
                </p>
                <p className="text-muted-foreground">
                  {getSettingValue('headteacher_title') || t('Principal', 'प्रधानाध्यापक')}, {t('Lautan Ram Dropadi Devi', 'लोटन राम द्रौपदी देवी')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
