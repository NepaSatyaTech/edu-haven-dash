import { Bell, Calendar, Clock, ChevronRight, FileText, Trophy, PartyPopper, Megaphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const categoryIcons: Record<string, any> = {
  General: Megaphone,
  Exam: FileText,
  Holiday: Calendar,
  Event: PartyPopper,
  Sports: Trophy,
  Academic: FileText,
  Meeting: Clock,
};

const categoryColors: Record<string, string> = {
  General: 'bg-gray-500/10 text-gray-600',
  Exam: 'bg-red-500/10 text-red-600',
  Holiday: 'bg-blue-500/10 text-blue-600',
  Event: 'bg-purple-500/10 text-purple-600',
  Sports: 'bg-amber-500/10 text-amber-600',
  Academic: 'bg-emerald-500/10 text-emerald-600',
  Meeting: 'bg-green-500/10 text-green-600',
};

export const NoticesSection = () => {
  const { t } = useLanguage();

  // Fetch notices from database
  const { data: notices = [] } = useQuery({
    queryKey: ['public-notices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Fetch events from database
  const { data: events = [] } = useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isRecent = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

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
              </div>

              <div className="divide-y divide-border">
                {notices.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    {t('No notices at the moment.', 'हाल कुनै सूचना छैन।')}
                  </div>
                ) : (
                  notices.map((notice) => {
                    const IconComponent = categoryIcons[notice.category] || Megaphone;
                    const colorClass = categoryColors[notice.category] || categoryColors.General;
                    return (
                      <div key={notice.id} className="p-5 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                    {notice.category}
                                  </span>
                                  {isRecent(notice.created_at) && (
                                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-bold">
                                      {t('NEW', 'नयाँ')}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-semibold">
                                  {notice.title}
                                </h4>
                                {notice.content && (
                                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {notice.content}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(notice.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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
                {events.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    {t('No upcoming events.', 'कुनै आगामी कार्यक्रम छैन।')}
                  </p>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="p-4 rounded-xl bg-card border">
                      <span className="text-sm text-primary font-semibold">
                        {formatDate(event.event_date)}
                      </span>
                      <h4 className="font-bold mt-1">
                        {event.title}
                      </h4>
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
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