import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Calendar, Search, FileText, Megaphone, Trophy, PartyPopper, Clock, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  General: 'bg-muted text-muted-foreground',
  Exam: 'bg-destructive/10 text-destructive',
  Holiday: 'bg-blue-500/10 text-blue-600',
  Event: 'bg-purple-500/10 text-purple-600',
  Sports: 'bg-amber-500/10 text-amber-600',
  Academic: 'bg-emerald-500/10 text-emerald-600',
  Meeting: 'bg-green-500/10 text-green-600',
};

const Notices = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'General', 'Exam', 'Holiday', 'Event', 'Sports', 'Academic'];

  const { data: notices = [] } = useQuery({
    queryKey: ['public-notices-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ['public-events-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notice.content && notice.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || notice.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isRecent = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)) <= 3;
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-20 bg-hero-gradient text-primary-foreground">
        <div className="container-custom mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-sm font-semibold mb-4">
            <Bell className="w-4 h-4 inline mr-1" />
            {t('Notices & Circulars', 'सूचना तथा परिपत्र')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('Stay ', 'अपडेट ')}<span className="text-gradient">{t('Updated', 'रहनुहोस्')}</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {t('All important announcements, exam notices, holidays, and circulars in one place.', 'सबै महत्वपूर्ण सूचना, परीक्षा नोटिस, बिदा, र परिपत्र एकै ठाउँमा।')}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t('Search notices...', 'सूचना खोज्नुहोस्...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Notices List */}
            <div className="lg:col-span-2">
              {filteredNotices.length === 0 ? (
                <div className="text-center py-16 glass-card">
                  <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('No notices found.', 'कुनै सूचना भेटिएन।')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotices.map((notice) => {
                    const IconComponent = categoryIcons[notice.category] || Megaphone;
                    const colorClass = categoryColors[notice.category] || categoryColors.General;
                    return (
                      <div key={notice.id} className="glass-card p-5 hover:shadow-card-hover transition-all">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded font-medium ${colorClass}`}>{notice.category}</span>
                              {isRecent(notice.created_at) && (
                                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-bold">{t('NEW', 'नयाँ')}</span>
                              )}
                              <span className="text-xs text-muted-foreground ml-auto">{formatDate(notice.created_at)}</span>
                            </div>
                            <h3 className="font-display font-bold text-lg">{notice.title}</h3>
                            {notice.content && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{notice.content}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {t('Upcoming Events', 'आगामी कार्यक्रम')}
                </h3>
                <div className="space-y-3">
                  {events.filter(e => new Date(e.event_date) >= new Date()).slice(0, 5).map((event) => (
                    <div key={event.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                      <span className="text-xs text-primary font-semibold">{formatDate(event.event_date)}</span>
                      <h4 className="font-bold text-sm mt-1">{event.title}</h4>
                      {event.location && <p className="text-xs text-muted-foreground">📍 {event.location}</p>}
                    </div>
                  ))}
                  {events.filter(e => new Date(e.event_date) >= new Date()).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">{t('No upcoming events.', 'कुनै आगामी कार्यक्रम छैन।')}</p>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-display font-bold mb-4">{t('Quick Links', 'द्रुत लिंकहरू')}</h3>
                <div className="space-y-2">
                  {[
                    t('📅 Academic Calendar', '📅 शैक्षिक पात्रो'),
                    t('📋 Exam Schedule', '📋 परीक्षा तालिका'),
                    t('🏖️ Holiday List', '🏖️ बिदा सूची'),
                    t('📄 Admission Circular', '📄 भर्ना परिपत्र'),
                  ].map((link) => (
                    <button key={link} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Notices;
