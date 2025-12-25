import { ArrowRight, BookOpen, Users, Award, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const HeroSection = () => {
  const { language, t } = useLanguage();
  const { data: settings, isLoading } = useSiteSettings();

  const getSettingValue = (key: string) => {
    if (!settings?.[key]) return '';
    return language === 'ne' && settings[key].value_ne 
      ? settings[key].value_ne 
      : settings[key].value_en;
  };

  const stats = [
    { icon: Users, value: getSettingValue('hero_students') || '750+', label: t('Students', 'विद्यार्थीहरू') },
    { icon: BookOpen, value: getSettingValue('hero_faculty') || '40+', label: t('Expert Faculty', 'विशेषज्ञ शिक्षक') },
    { icon: Award, value: getSettingValue('hero_success_rate') || '98%', label: t('Success Rate', 'सफलता दर') },
    { icon: GraduationCapIcon, value: getSettingValue('hero_years_legacy') || '50+', label: t('Years Legacy', 'वर्षको विरासत') },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl animate-pulse delay-300" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10 container-custom mx-auto px-4 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground/90 text-sm font-medium mb-8 animate-fade-up">
            <Award className="h-4 w-4 text-secondary" />
            <span>{t('Ranked #1 in Academic Excellence 2024', '२०२४ मा शैक्षिक उत्कृष्टतामा #१')}</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-4 leading-tight animate-fade-up delay-100">
            {language === 'ne' ? (
              <>
                {getSettingValue('school_name_ne') || 'श्री लोटन राम द्रौपदी देवी माध्यमिक विद्यालय'}
                <br />
                <span className="text-gradient">{getSettingValue('school_address') || 'विजय नगर-७, गणेशपुर'}</span>
              </>
            ) : (
              <>
                {getSettingValue('school_name_en') || 'Shree Lautan Ram Dropadi Devi Secondary School'}
                <br />
                <span className="text-gradient">{settings?.['school_address']?.value_en || 'Bijaynagar-7, Ganeshpur'}</span>
              </>
            )}
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-10 font-body leading-relaxed animate-fade-up delay-200">
            {t(
              'Welcome to Lautan Ram Dropadi Devi Secondary School, where tradition meets innovation. We nurture young minds with world-class education, holistic development, and values that last a lifetime.',
              'लोटन राम द्रौपदी देवी माध्यमिक विद्यालयमा स्वागत छ, जहाँ परम्परा र नवीनता भेट्छन्। हामी विश्वस्तरीय शिक्षा, समग्र विकास, र जीवनभर टिक्ने मूल्यहरूद्वारा युवा मनहरूको पालनपोषण गर्छौं।'
            )}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <Button variant="hero" size="xl" className="group">
              {t('Apply Now', 'अहिले आवेदन दिनुहोस्')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroOutline" size="xl">
              <Play className="h-5 w-5" />
              {t('Virtual Tour', 'भर्चुअल भ्रमण')}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-fade-up delay-400">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group p-4 md:p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

function GraduationCapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}
