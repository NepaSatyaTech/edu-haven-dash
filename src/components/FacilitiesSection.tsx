import { 
  BookOpenCheck, 
  FlaskConical, 
  Monitor, 
  Trophy, 
  Bus, 
  Utensils, 
  Stethoscope,
  Wifi,
  Trees
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const FacilitiesSection = () => {
  const { t } = useLanguage();

  const facilities = [
    {
      icon: BookOpenCheck,
      title: t('Modern Library', 'आधुनिक पुस्तकालय'),
      description: t(
        'Over 50,000 books, digital resources, and quiet study zones for focused learning.',
        '५०,००० भन्दा बढी पुस्तकहरू, डिजिटल स्रोतहरू, र ध्यान केन्द्रित अध्ययनका लागि शान्त स्थानहरू।'
      ),
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      icon: FlaskConical,
      title: t('Science Labs', 'विज्ञान प्रयोगशालाहरू'),
      description: t(
        'State-of-the-art Physics, Chemistry, and Biology labs with latest equipment.',
        'अत्याधुनिक भौतिक, रसायन, र जीवविज्ञान प्रयोगशालाहरू नवीनतम उपकरणसहित।'
      ),
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      icon: Monitor,
      title: t('Computer Lab', 'कम्प्युटर प्रयोगशाला'),
      description: t(
        'High-speed internet, latest computers, and dedicated coding stations.',
        'उच्च-गति इन्टरनेट, नवीनतम कम्प्युटर, र समर्पित कोडिङ स्टेशनहरू।'
      ),
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      icon: Trophy,
      title: t('Sports Complex', 'खेलकुद परिसर'),
      description: t(
        'Indoor stadium, outdoor fields, swimming pool, and professional coaching.',
        'भित्री रंगशाला, बाहिरी मैदान, पौडी पोखरी, र पेशेवर प्रशिक्षण।'
      ),
      color: 'bg-orange-500/10 text-orange-600',
    },
    {
      icon: Bus,
      title: t('Transportation', 'परिवहन'),
      description: t(
        'GPS-enabled buses covering all major routes with trained drivers.',
        'GPS-सक्षम बसहरू, सबै प्रमुख मार्गहरूमा प्रशिक्षित चालकसहित।'
      ),
      color: 'bg-red-500/10 text-red-600',
    },
    {
      icon: Utensils,
      title: t('Cafeteria', 'भान्सा'),
      description: t(
        'Hygienic kitchen serving healthy, balanced meals throughout the day.',
        'स्वच्छ भान्सा, दिनभरि स्वस्थ, सन्तुलित खाना उपलब्ध।'
      ),
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      icon: Stethoscope,
      title: t('Medical Room', 'स्वास्थ्य कक्ष'),
      description: t(
        'Full-time nurse, first aid facilities, and regular health checkups.',
        'पूर्णकालिक नर्स, प्राथमिक उपचार सुविधा, र नियमित स्वास्थ्य जाँच।'
      ),
      color: 'bg-rose-500/10 text-rose-600',
    },
    {
      icon: Wifi,
      title: t('Smart Classrooms', 'स्मार्ट कक्षाहरू'),
      description: t(
        'Interactive boards, projectors, and high-speed WiFi in every classroom.',
        'हरेक कक्षामा अन्तरक्रियात्मक बोर्ड, प्रोजेक्टर, र उच्च-गति WiFi।'
      ),
      color: 'bg-cyan-500/10 text-cyan-600',
    },
    {
      icon: Trees,
      title: t('Green Campus', 'हरित क्याम्पस'),
      description: t(
        'Eco-friendly campus with gardens, solar panels, and rainwater harvesting.',
        'बगैंचा, सौर प्यानल, र वर्षा जल सङ्ग्रह सहितको वातावरणमैत्री क्याम्पस।'
      ),
      color: 'bg-green-500/10 text-green-600',
    },
  ];

  const stats = [
    { value: '10', unit: t('Acres', 'एकड'), label: t('Campus Area', 'क्याम्पस क्षेत्रफल') },
    { value: '40+', unit: '', label: t('Classrooms', 'कक्षाहरू') },
    { value: '0', unit: '', label: t('Bus Routes', 'बस मार्गहरू') },
    { value: '10+', unit: '', label: t('CCTV Cameras', 'CCTV क्यामेरा') },
  ];

  return (
    <section id="facilities" className="section-padding bg-background">
      <div className="container-custom mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-4">
            {t('Facilities', 'सुविधाहरू')}
          </span>
          <h2 className="section-title">
            {t('World-Class Infrastructure', 'विश्वस्तरीय पूर्वाधार')}
          </h2>
          <p className="section-subtitle">
            {t(
              'Our campus is equipped with modern facilities to support comprehensive learning and development of every student.',
              'हाम्रो क्याम्पसमा प्रत्येक विद्यार्थीको समग्र शिक्षा र विकासको लागि आधुनिक सुविधाहरू उपलब्ध छन्।'
            )}
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility.title}
              className="group glass-card p-6 hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${facility.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
              >
                <facility.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground mb-2">
                {facility.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {facility.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-20 glass-card p-8 md:p-12 bg-gradient-to-r from-primary to-primary/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-1">
                  {stat.value}
                  <span className="text-lg text-primary-foreground/80">{stat.unit}</span>
                </div>
                <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
