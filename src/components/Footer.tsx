import { GraduationCap, Heart, ArrowUp } from 'lucide-react';

const quickLinks = [
  { name: 'About Us', href: '#about' },
  { name: 'Academics', href: '#academics' },
  { name: 'Admissions', href: '#admissions' },
  { name: 'Facilities', href: '#facilities' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' },
];

const resources = [
  { name: 'Academic Calendar', href: '#' },
  { name: 'Fee Structure', href: '#' },
  { name: 'School Policies', href: '#' },
  { name: 'Career Opportunities', href: '#' },
  { name: 'Alumni Network', href: '#' },
  { name: 'Student Portal', href: '#' },
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-custom mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* School Info */}
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary-foreground/10">
                <GraduationCap className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <span className="text-xl font-display font-bold">Lautan Ram Dropadi Devi</span>
                <p className="text-xs text-primary-foreground/70">Excellence in Education</p>
              </div>
            </a>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              Nurturing minds, building futures. Lautan Ram Dropadi Devi has been shaping 
              leaders for over 50 years with excellence in education and holistic development.
            </p>
            <p className="text-sm text-primary-foreground/70">
              NEB Affiliation No: 273001
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Quick Links</h4>
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
            <h4 className="font-display font-bold text-lg mb-6">Resources</h4>
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
            <h4 className="font-display font-bold text-lg mb-6">Stay Connected</h4>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Subscribe to our newsletter for updates and news.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-sm"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/70 flex items-center gap-1">
            © 2024 Lautan Ram Dropadi Devi. Made with <Heart className="w-4 h-4 text-secondary fill-secondary" /> for Education
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
              Terms of Service
            </a>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
