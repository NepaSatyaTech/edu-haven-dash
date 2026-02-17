import { Navbar } from '@/components/Navbar';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Award, Trophy, Star, Calendar, Users, BookOpen, GraduationCap, Medal } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();
  const { data: settings } = useSiteSettings();

  const achievements = [
    {
      year: '1974',
      title: t('School Founded', 'विद्यालय स्थापना'),
      description: t('Established with a vision to provide quality education to the community.', 'समुदायलाई गुणस्तरीय शिक्षा प्रदान गर्ने दृष्टिकोणका साथ स्थापना।'),
    },
    {
      year: '1985',
      title: t('NEB Affiliation', 'NEB सम्बन्धन'),
      description: t('Received official affiliation from the National Examination Board.', 'राष्ट्रिय परीक्षा बोर्डबाट आधिकारिक सम्बन्धन प्राप्त।'),
    },
    {
      year: '1995',
      title: t('Higher Secondary Added', 'उच्च माध्यमिक थप'),
      description: t('Expanded to include Grade 11-12 with Science and Management streams.', 'विज्ञान र व्यवस्थापन संकायसहित कक्षा ११-१२ विस्तार।'),
    },
    {
      year: '2005',
      title: t('Modern Campus Built', 'आधुनिक क्याम्पस निर्माण'),
      description: t('New campus with science labs, library, and sports facilities inaugurated.', 'विज्ञान प्रयोगशाला, पुस्तकालय र खेलकुद सुविधासहित नयाँ क्याम्पस उद्घाटन।'),
    },
    {
      year: '2015',
      title: t('Digital Classrooms', 'डिजिटल कक्षाकोठा'),
      description: t('Smart classrooms with projectors and internet connectivity installed.', 'प्रोजेक्टर र इन्टरनेट कनेक्टिभिटीसहित स्मार्ट कक्षाकोठा स्थापना।'),
    },
    {
      year: '2024',
      title: t('50 Years of Excellence', '५० वर्षको उत्कृष्टता'),
      description: t('Celebrating golden jubilee with over 10,000 successful alumni.', '१०,००० भन्दा बढी सफल पूर्व-विद्यार्थीहरूसँग स्वर्ण जयन्ती मनाउँदै।'),
    },
  ];

  const awards = [
    { icon: Trophy, title: t('Best School Award 2023', 'उत्कृष्ट विद्यालय पुरस्कार २०२३'), org: t('District Education Office', 'जिल्ला शिक्षा कार्यालय') },
    { icon: Star, title: t('Academic Excellence', 'शैक्षिक उत्कृष्टता'), org: t('NEB Board', 'NEB बोर्ड') },
    { icon: Medal, title: t('Sports Achievement', 'खेलकुद उपलब्धि'), org: t('District Sports Committee', 'जिल्ला खेलकुद समिति') },
    { icon: Award, title: t('Green Campus Award', 'हरित क्याम्पस पुरस्कार'), org: t('Environment Ministry', 'वातावरण मन्त्रालय') },
  ];

  const coreValues = [
    { icon: BookOpen, title: t('Academic Excellence', 'शैक्षिक उत्कृष्टता'), desc: t('Commitment to highest standards of learning and teaching.', 'सिकाइ र शिक्षणको उच्चतम मापदण्डप्रति प्रतिबद्धता।') },
    { icon: Users, title: t('Community & Brotherhood', 'समुदाय र भ्रातृत्व'), desc: t('Building strong bonds and mutual respect among students.', 'विद्यार्थीहरू बीच बलियो सम्बन्ध र आपसी सम्मान निर्माण।') },
    { icon: GraduationCap, title: t('Character Building', 'चरित्र निर्माण'), desc: t('Developing responsible, ethical, and compassionate citizens.', 'जिम्मेवार, नैतिक, र करुणाशील नागरिक विकास।') },
    { icon: Star, title: t('Innovation & Growth', 'नवीनता र विकास'), desc: t('Embracing modern methods while honoring traditions.', 'परम्पराको सम्मान गर्दै आधुनिक विधिहरू अपनाउँदै।') },
  ];

  const stats = [
    { value: '50+', label: t('Years of Legacy', 'वर्षको विरासत') },
    { value: '10,000+', label: t('Alumni', 'पूर्व-विद्यार्थी') },
    { value: '100+', label: t('Faculty Members', 'शिक्षकहरू') },
    { value: '98%', label: t('Pass Rate', 'उत्तीर्ण दर') },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="pt-20 bg-hero-gradient text-primary-foreground">
        <div className="container-custom mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-semibold mb-4">
              {t('About Us', 'हाम्रो बारेमा')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              {t('Our Story of ', 'हाम्रो कथा ')}<span className="text-gradient">{t('Excellence', 'उत्कृष्टता')}</span>
            </h1>
            <p className="text-lg text-primary-foreground/80">
              {t(
                'For over five decades, we have been shaping young minds and building future leaders with quality education and values.',
                'पाँच दशकभन्दा बढी समयदेखि, हामीले गुणस्तरीय शिक्षा र मूल्यहरूका साथ युवा मनहरूलाई आकार दिँदै र भविष्यका नेताहरू बनाउँदै आएका छौं।'
              )}
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-display font-bold text-secondary">{stat.value}</div>
                <p className="text-sm text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main About Section */}
      <AboutSection />

      {/* Core Values */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Our Core Values', 'हाम्रा मूल मूल्यहरू')}</h2>
            <p className="section-subtitle">{t('The principles that guide everything we do.', 'हामीले गर्ने हरेक कामलाई मार्गदर्शन गर्ने सिद्धान्तहरू।')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => (
              <div key={value.title} className="glass-card p-6 text-center hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-display font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Timeline */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Our Journey', 'हाम्रो यात्रा')}</h2>
            <p className="section-subtitle">{t('Milestones that shaped our institution.', 'हाम्रो संस्थालाई आकार दिने मिल्काहरू।')}</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            <div className="space-y-8">
              {achievements.map((item, index) => (
                <div key={item.year} className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-display font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">{item.year}</span>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Awards & Recognition', 'पुरस्कार तथा मान्यता')}</h2>
            <p className="section-subtitle">{t('Honored for our commitment to education.', 'शिक्षाप्रतिको प्रतिबद्धताको लागि सम्मानित।')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award) => (
              <div key={award.title} className="glass-card p-6 text-center hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <award.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-display font-bold mb-1">{award.title}</h3>
                <p className="text-sm text-muted-foreground">{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
