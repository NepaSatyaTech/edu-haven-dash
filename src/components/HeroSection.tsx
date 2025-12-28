import { ArrowRight, BookOpen, Users, Award, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext'; // Assumes a language context

// Function to convert numbers to Nepali digits
function toNepaliNumber(number) {
  const nepaliDigits = ['०','१','२','३','४','५','६','७','८','९'];
  return number.toString().replace(/\d/g, d => nepaliDigits[d]);
}

export const HeroSection = () => {
  const { t, language } = useLanguage(); // added language to check

  const stats = [
    { icon: Users, value: language === 'ne' ? toNepaliNumber('750') + '+' : '750+', label: t('Students', 'विद्यार्थीहरू') },
    { icon: BookOpen, value: language === 'ne' ? toNepaliNumber('40') + '+' : '40+', label: t('Expert Teachers', 'विशेषज्ञ शिक्षक') },
    { icon: Award, value: language === 'ne' ? toNepaliNumber('98') + '%' : '98%', label: t('Success Rate', 'सफलता दर') },
    { icon: GraduationCapIcon, value: language === 'ne' ? toNepaliNumber('50') + '+' : '50+', label: t('Years of Legacy', 'वर्षको विरासत') },
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
      </div>

      <div className="relative z-10 container-custom mx-auto px-4 pt-20">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground/90 text-sm font-medium mb-8">
            <Award className="h-4 w-4 text-secondary" />
            <span>{t('Ranked #1 in Academic Excellence 2024', '२०२४ मा शैक्षिक उत्कृष्टतामा #१')}</span>
          </div>

          {/* School Name */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-4 leading-tight">
            {t(
              'Shree Lautan Ram Dropadi Devi Secondary School',
              'श्री लौटन राम द्रौपदी देवी माध्यमिक विद्यालय'
            )}
            <br />
            <span className="text-gradient">{t('Bijaynagar–7, Ganeshpur', 'विजयनगर–७, गणेशपुर')}</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t(
              "Welcome to Lautan Ram Dropadi Devi Secondary School. Tradition meets innovation here. We provide world-class education, holistic development, and life-value-based learning for a bright future.",
              "श्री लौटन राम द्रौपदी देवी माध्यमिक विद्यालयमा स्वागत छ। यहाँ परम्परा र नवीनता सँगै अघि बढ्छन्। हामी विश्वस्तरीय शिक्षा, समग्र विकास र जीवनमूल्यमा आधारित शिक्षाद्वारा विद्यार्थीहरूको उज्ज्वल भविष्य निर्माण गर्छौं।"
            )}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-4 md:p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10"
              >
                <stat.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

/* Graduation Icon */
function GraduationCapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}
