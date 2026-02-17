import { Navbar } from '@/components/Navbar';
import { FacilitiesSection } from '@/components/FacilitiesSection';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Camera, Lock, Bell } from 'lucide-react';

const Facilities = () => {
  const { t } = useLanguage();

  const securityFeatures = [
    { icon: Camera, title: t('CCTV Surveillance', 'CCTV निगरानी'), desc: t('24/7 CCTV monitoring across entire campus with centralized control room.', 'केन्द्रीकृत नियन्त्रण कक्षसहित सम्पूर्ण क्याम्पसमा २४/७ CCTV निगरानी।') },
    { icon: Shield, title: t('Security Guards', 'सुरक्षा गार्डहरू'), desc: t('Trained security personnel stationed at all entry points and campus boundaries.', 'सबै प्रवेश बिन्दुहरू र क्याम्पस सीमानामा प्रशिक्षित सुरक्षा कर्मचारीहरू।') },
    { icon: Lock, title: t('Visitor Management', 'आगन्तुक व्यवस्थापन'), desc: t('Digital visitor log with ID verification and parent notification system.', 'ID प्रमाणीकरण र अभिभावक सूचना प्रणालीसहित डिजिटल आगन्तुक लग।') },
    { icon: Bell, title: t('Emergency System', 'आपतकालीन प्रणाली'), desc: t('Fire alarms, emergency exits, and regular safety drills for all students.', 'आगो अलार्म, आपतकालीन निकास, र सबै विद्यार्थीहरूको लागि नियमित सुरक्षा अभ्यास।') },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-20 bg-hero-gradient text-primary-foreground">
        <div className="container-custom mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-sm font-semibold mb-4">
            {t('Facilities', 'सुविधाहरू')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('World-Class ', 'विश्वस्तरीय ')}<span className="text-gradient">{t('Infrastructure', 'पूर्वाधार')}</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {t('Modern facilities designed to support comprehensive learning and holistic development.', 'समग्र शिक्षा र समग्र विकासलाई समर्थन गर्न डिजाइन गरिएका आधुनिक सुविधाहरू।')}
          </p>
        </div>
      </div>

      {/* Main Facilities */}
      <FacilitiesSection />

      {/* Safety & Security */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Safety & Security', 'सुरक्षा प्रणाली')}</h2>
            <p className="section-subtitle">{t('Your child\'s safety is our top priority.', 'तपाईंको बालबालिकाको सुरक्षा हाम्रो प्राथमिकता हो।')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature) => (
              <div key={feature.title} className="glass-card p-6 text-center hover:shadow-card-hover transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="font-display font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Facilities;
