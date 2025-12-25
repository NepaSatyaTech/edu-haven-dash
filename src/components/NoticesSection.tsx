import { Bell, Calendar, Clock, ChevronRight, FileText, Trophy, PartyPopper } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const NoticesSection = () => {
  const { t } = useLanguage();

  const notices = [
    {
      id: 1,
      title: t(
        'Winter Break Holiday Notice',
        'शीतकालीन बिदा सम्बन्धी सूचना'
      ),
      date: t('Dec 20, 2024', '२० डिसेम्बर २०२४'),
      category: t('Holiday', 'बिदा'),
      icon: Calendar,
      color: 'bg-blue-500/10 text-blue-600',
      isNew: true,
    },
    {
      id: 2,
      title: t(
        'Annual Day Celebration – 2024',
        'वार्षिक उत्सव समारोह – २०२४'
      ),
      date: t('Dec 15, 2024', '१५ डिसेम्बर २०२४'),
      category: t('Event', 'कार्यक्रम'),
      icon: PartyPopper,
      color: 'bg-purple-500/10 text-purple-600',
      isNew: true,
    },
    {
      id: 3,
      title: t(
        'Class 10 Board Exam Schedule Released',
        'कक्षा १० को बोर्ड परीक्षाको तालिका सार्वजनिक'
      ),
      date: t('Dec 10, 2024', '१० डिसेम्बर २०२४'),
      category: t('Exam', 'परीक्षा'),
      icon: FileText,
      color: 'bg-red-500/10 text-red-600',
      isNew: false,
    },
    {
      id: 4,
      title: t(
        'Inter-School Sports Competition Results',
        'अन्तरविद्यालय खेलकुद प्रतियोगिताको नतिजा'
      ),
      date: t('Dec 5, 2024', '५ डिसेम्बर २०२४'),
      category: t('Sports', 'खेलकुद'),
      icon: Trophy,
      color: 'bg-amber-500/10 text-amber-600',
      isNew: false,
    },
    {
      id: 5,
      title: t(
        'Parent–Teacher Meeting Schedule',
        'अभिभावक–शिक्षक बैठकको तालिका'
      ),
      date: t('Dec 1, 2024', '१ डिसेम्बर २०२४'),
      category: t('Meeting', 'बैठक'),
      icon: Clock,
      color: 'bg-green-500/10 text-green-600',
      isNew: false,
    },
  ];

  const events = [
    {
      title: t('Science Exhibition', 'विज्ञान प्रदर्शनी'),
      date: t('Jan 15, 2025', '१५ जनवरी २०२५'),
      description: t(
        'Students showcase innovative science projects',
        'विद्यार्थीहरूले नवीन विज्ञान परियोजना प्रस्तुत गर्नेछन्'
      ),
    },
    {
      title: t('Republic Day Celebration', 'गणतन्त्र दिवस समारोह'),
      date: t('Jan 26, 2025', '२६ जनवरी २०२५'),
      description: t(
        'Flag hoisting and cultural programs',
        'झण्डोत्तोलन तथा सांस्कृतिक कार्यक्रम'
      ),
    },
    {
      title: t('Annual Sports Meet', 'वार्षिक खेलकुद महोत्सव'),
      date: t('Feb 10–12, 2025', '१०–१२ फेब्रुअरी २०२५'),
      description: t(
        'Three-day inter-house sports competition',
        'तीन दिने अन्तर सदन खेलकुद प्रतियोगिता'
      ),
    },
  ];

  return (
    <section id="notices" className="section-padding bg-muted/50">
      <div className="container-custom mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-4">
            <Bell className="w-4 h-4 inline mr-1" />
            {t('Notices & Events', 'सूचना तथा कार्यक्रम')}
          </span>
          <h2 className="section-title">
            {t('Stay Updated', 'अपडेट रहनुहोस्')}
          </h2>
          <p className="section-subtitle">
            {t(
              'Important announcements and upcoming events from our school.',
              'विद्यालयका महत्वपूर्ण सूचना तथा आगामी कार्यक्रमहरू।'
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Notices */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-display font-bold">
                  {t('Latest Notices', 'पछिल्ला सूचनाहरू')}
                </h3>
                <a href="#" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                  {t('View All', 'सबै हेर्नुहोस्')}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              <div className="divide-y divide-border">
                {notices.map((notice) => (
                  <div key={notice.id} className="p-5 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${notice.color} flex items-center justify-center`}>
                        <notice.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                {notice.category}
                              </span>
                              {notice.isNew && (
                                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-bold">
                                  {t('NEW', 'नयाँ')}
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold">
                              {notice.title}
                            </h4>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {notice.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Events */}
          <div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {t('Upcoming Events', 'आगामी कार्यक्रम')}
              </h3>

              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.title} className="p-4 rounded-xl bg-card border">
                    <span className="text-sm text-primary font-semibold">
                      {event.date}
                    </span>
                    <h4 className="font-bold mt-1">
                      {event.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-secondary/10">
                <p className="text-sm font-medium mb-2">
                  📅 {t('Academic Calendar 2024–25', 'शैक्षिक पात्रो २०२४–२५')}
                </p>
                <a href="#" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                  {t('Download PDF', 'PDF डाउनलोड गर्नुहोस्')}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
