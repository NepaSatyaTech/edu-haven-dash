import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';

interface NavLink {
  name: string;
  nameNe: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', nameNe: 'गृहपृष्ठ', href: '/' },
  { name: 'About', nameNe: 'हाम्रो बारेमा', href: '/about' },
  { name: 'Academics', nameNe: 'शैक्षिक', href: '/academics' },
  { name: 'Admissions', nameNe: 'भर्ना', href: '/admissions' },
  { name: 'Faculty', nameNe: 'शिक्षक', href: '/faculty' },
  { name: 'Facilities', nameNe: 'सुविधाहरू', href: '/facilities' },
  { name: 'Gallery', nameNe: 'ग्यालरी', href: '/gallery' },
  { name: 'Notices', nameNe: 'सूचनाहरू', href: '/notices' },
  { name: 'Contact', nameNe: 'सम्पर्क', href: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      // If we're on the home page, scroll to section
      if (location.pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home page with hash
        window.location.href = '/' + href;
      }
    }
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ne' : 'en');
  };

  // Determine if we're on the home page (transparent bg) or inner page (always solid bg)
  const isHomePage = location.pathname === '/';
  const solidNav = scrolled || !isHomePage;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solidNav
          ? 'bg-card/95 backdrop-blur-lg shadow-lg border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group"
          >
            <div className="flex flex-col">
              <span className={`text-xl font-display font-bold tracking-tight transition-colors ${
                solidNav ? 'text-foreground' : 'text-primary-foreground'
              }`}>
                {t('Lautan Ram Dropadi Devi', 'लौटन राम द्रौपदी देवी')}
              </span>
              <span className={`text-xs font-body tracking-wider transition-colors ${
                solidNav ? 'text-muted-foreground' : 'text-primary-foreground/70'
              }`}>
                {t('Excellence in Education', 'शिक्षामा उत्कृष्टता')}
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : solidNav
                        ? 'text-foreground hover:bg-primary/10 hover:text-primary'
                        : 'text-primary-foreground/90 hover:bg-primary-foreground/15 hover:text-primary-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {language === 'ne' ? link.nameNe : link.name}
                </Link>
              );
            })}
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                solidNav
                  ? 'text-foreground hover:bg-accent/10 hover:text-accent'
                  : 'text-primary-foreground/90 hover:bg-primary-foreground/15'
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'नेपाली' : 'EN'}</span>
            </button>

            <Link to="/admin/login">
              <Button
                variant={solidNav ? 'default' : 'heroOutline'}
                size="sm"
                className="ml-2 rounded-full"
              >
                {t('Admin Login', 'व्यवस्थापक लगइन')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              solidNav
                ? 'text-foreground hover:bg-muted'
                : 'text-primary-foreground hover:bg-primary-foreground/10'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-1 bg-card/95 backdrop-blur-lg rounded-2xl mb-4 px-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {language === 'ne' ? link.nameNe : link.name}
                </Link>
              );
            })}
            
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-foreground font-medium transition-colors hover:bg-primary/10"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'नेपाली भाषा' : 'English Language'}
            </button>
            
            <div className="pt-2 px-2">
              <Link to="/admin/login">
                <Button variant="default" className="w-full rounded-full">
                  {t('Admin Login', 'व्यवस्थापक लगइन')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
