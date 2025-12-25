import { GraduationCap, Heart, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { name: t('About Us', 'हाम्रो बारेमा'), href: '#about' },
    { name: t('Academics', 'शैक्षिक कार्यक्रम'), href: '#academics' },
    { name: t('Admissions', 'भर्ना'), href: '#admissions' },
    { name: t('Facilities', 'सुविधाहरू'), href: '#facilities' },
    { name: t('Gallery', 'ग्यालेरी'), href: '#gallery' },
    { name: t('Contact', 'सम्पर्क'), href: '#contact' },
  ];

  const resources = [
    { name: t('Academic Calendar', 'शैक्षिक पात्रो'), href: '#' },
    { name: t('Fee Structure', 'शुल्क संरचना'), href: '#' },
    { name: t('School Policies', 'विद्यालय नीतिहरू'), href: '#' },
    { name: t('Career Opportunities', 'करियर अवसरहरू'), href: '#' },
    { name: t('Alumni Network', 'पूर्व विद्यार्थी सञ्जाल'), href: '#' },
    { name: t('Student Portal', 'विद्यार्थी पोर्टल'), href: '#' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-custom mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* School Info */}
          <div>
            <a href="#home" className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary-foreground/10">
                <GraduationCap className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <span className="text-xl font-display font-bold">
                  {t('Lautan Ram Dropadi Devi', 'लोटन राम द्रौपदी देवी')}
                </span>
                <p className="text-xs text-primary-foreground/70">
                  {t('Excellence in Education', 'शिक्षामा उत्कृष्टता')}
                </p>
              </div>
            </a>

            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              {t(
                'Nurturing minds, building futures. Lautan Ram Dropadi Devi has been shaping leaders for over 50 years with excellence in education and holistic development.',
                'मनहरूलाई संस्कार दिने र भविष्य निर्माण गर्ने। लोटन राम द्रौपदी देवीले ५० वर्षभन्दा बढी समयदेखि शैक्षिक उत्कृष्टता र समग्र विकासमार्फत नेतृत्व निर्माण गर्दै आएको छ।'
              )}
            </p>

            <p className="text-sm text-primary-foreground/70">
              {t('NEB Affiliation No:', 'NEB मान्यता नं:')} 273001
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">
              {t('Quick Links', 'छिटो लिंकहरू')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">
              {t('Resources', 'स्रोतहरू')}
            </h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">
              {t('Stay Connected', 'सम्पर्कमा रहनुहोस्')}
            </h4>
            <p className="text-primary-foreground/80 text-sm mb-4">
              {t(
                'Subscribe to our newsletter for updates and news.',
                'नवीनतम सूचना र समाचारका लागि हाम्रो समाचारपत्रमा सदस्यता लिनुहोस्।'
              )}
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder={t('Enter your email', 'आफ्नो इमेल लेख्नुहोस्')}
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-sm"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors text-sm"
              >
                {t('Subscribe', 'सदस्यता लिनुहोस्')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/70 flex items-center gap-1">
            © 2024 {t('Lautan Ram Dropadi Devi', 'लोटन राम द्रौपदी देवी')} •{' '}
            {t('Made with', 'प्रेमसाथ तयार गरिएको')}{' '}
            <Heart className="w-4 h-4 text-secondary fill-secondary" />{' '}
            {t('for Education', 'शिक्षाको लागि')}
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-primary-foreground/70 hover:text-secondary">
              {t('Privacy Policy', 'गोपनीयता नीति')}
            </a>
            <a href="#" className="text-sm text-primary-foreground/70 hover:text-secondary">
              {t('Terms of Service', 'सेवाका सर्तहरू')}
            </a>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all"
              aria-label={t('Back to top', 'माथि जानुहोस्')}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
