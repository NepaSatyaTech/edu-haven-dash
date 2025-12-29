import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext'; // Assume we have this context

export const ContactSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('Message Sent!', 'सन्देश पठाइयो!'),
      description: t(
        "Thank you for reaching out. We'll respond within 24-48 hours.",
        'सम्पर्क गर्नु भएकोमा धन्यवाद। हामी २४–४८ घण्टाभित्र जवाफ दिनेछौं।'
      ),
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('Address', 'ठेगाना'),
      lines: [t('Bijaynagar 7, Ganeshpur', 'विजयनगर ७, गणेशपुर'), t('Kapilvastu, Nepal - 32900', 'कपिलवस्तु, नेपाल - ३२९००')],
    },
    {
      icon: Phone,
      title: t('Phone', 'फोन'),
      lines: ['+977 9817425483', '+977 984-7424894'],
    },
    {
      icon: Mail,
      title: t('Email', 'इमेल'),
      lines: ['lautanramdropadidevischool@gmail.com', 'admissions@lautandropadidevi.edu'],
    },
    {
      icon: Clock,
      title: t('Office Hours', 'कार्यालय समय'),
      lines: [t('Sunday - Friday: 8:00 AM - 4:00 PM', 'आइतबार - शुक्रबार: ८:०० बिहान - ४:०० अपराह्न')],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            {t('Contact Us', 'सम्पर्क गर्नुहोस्')}
          </span>
          <h2 className="section-title">{t('Get In Touch', 'सम्पर्कमा आउनुहोस्')}</h2>
          <p className="section-subtitle">
            {t(
              "Have questions? We'd love to hear from you. Reach out to us through any of the channels below.",
              'कुनै प्रश्न छ? हामी तपाईंको सम्पर्कको लागि उत्साहित छौं। तलका कुनै पनि माध्यमबाट हामीलाई सम्पर्क गर्नुहोस्।'
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info) => (
                <div key={info.title} className="glass-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2">{info.title}</h3>
                  {info.lines.map((line, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            {/* Map Section */}
<div className="glass-card p-2 h-64 overflow-hidden">
  <div className="w-full h-full rounded-lg overflow-hidden relative">
    
    {/* Map Image */}
    <img
      src="/map.png"
      alt="School Location Map"
      className="w-full h-full object-cover"
    />

    {/* Overlay Content */}
    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
      <div className="text-center text-white">
        {/* <MapPin className="w-10 h-10 mx-auto mb-2 text-white" /> */}
        <p className="font-semibold">
          {t('School Location', 'विद्यालयको स्थान')}
        </p>
        <p className="text-sm opacity-90">
          {t(
            'Shree Lautanram Dropatidevi Secondary School, Bijaynagar',
            'श्री लौटन राम द्रौपदी देवी माध्यमिक विद्यालय, विजयनगर'
          )}
        </p>
      </div>
    </div>

  </div>
</div>


            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">{t('Follow Us:', 'हामीलाई फलो गर्नुहोस्:')}</span>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-xl font-display font-bold text-foreground mb-6">
              {t('Send Us a Message', 'हामीलाई सन्देश पठाउनुहोस्')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('Your Name *', 'तपाईंको नाम *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder={t('Enter your name', 'तपाईंको नाम लेख्नुहोस्')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('Email *', 'इमेल *')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder={t('Enter your email', 'तपाईंको इमेल लेख्नुहोस्')}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('Phone', 'फोन')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder={t('Enter phone number', 'फोन नम्बर लेख्नुहोस्')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('Subject *', 'विषय *')}
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">{t('Select Subject', 'विषय छान्नुहोस्')}</option>
                    <option value="admission">{t('Admission Inquiry', 'भर्ना सम्बन्धी प्रश्न')}</option>
                    <option value="academic">{t('Academic Query', 'शैक्षिक प्रश्न')}</option>
                    <option value="fee">{t('Fee Related', 'शुल्क सम्बन्धी')}</option>
                    <option value="transport">{t('Transportation', 'परिवहन')}</option>
                    <option value="other">{t('Other', 'अन्य')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('Message *', 'सन्देश *')}
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder={t('Write your message here...', 'यहाँ तपाईंको सन्देश लेख्नुहोस्...')}
                />
              </div>

              <Button type="submit" variant="gold" size="lg" className="w-full gap-2">
                <Send className="w-4 h-4" />
                {t('Send Message', 'सन्देश पठाउनुहोस्')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
