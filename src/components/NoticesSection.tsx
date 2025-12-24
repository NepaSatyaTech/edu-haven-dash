import { Bell, Calendar, Clock, ChevronRight, FileText, Trophy, PartyPopper } from 'lucide-react';

const notices = [
  {
    id: 1,
    title: 'Winter Break Holiday Notice',
    date: 'Dec 20, 2024',
    category: 'Holiday',
    icon: Calendar,
    color: 'bg-blue-500/10 text-blue-600',
    isNew: true,
  },
  {
    id: 2,
    title: 'Annual Day Celebration - 2024',
    date: 'Dec 15, 2024',
    category: 'Event',
    icon: PartyPopper,
    color: 'bg-purple-500/10 text-purple-600',
    isNew: true,
  },
  {
    id: 3,
    title: 'Class 10 Board Exam Schedule Released',
    date: 'Dec 10, 2024',
    category: 'Exam',
    icon: FileText,
    color: 'bg-red-500/10 text-red-600',
    isNew: false,
  },
  {
    id: 4,
    title: 'Inter-School Sports Competition Results',
    date: 'Dec 5, 2024',
    category: 'Sports',
    icon: Trophy,
    color: 'bg-amber-500/10 text-amber-600',
    isNew: false,
  },
  {
    id: 5,
    title: 'Parent-Teacher Meeting Schedule',
    date: 'Dec 1, 2024',
    category: 'Meeting',
    icon: Clock,
    color: 'bg-green-500/10 text-green-600',
    isNew: false,
  },
];

const events = [
  {
    title: 'Science Exhibition',
    date: 'Jan 15, 2025',
    description: 'Students showcase innovative science projects',
  },
  {
    title: 'Republic Day Celebration',
    date: 'Jan 26, 2025',
    description: 'Flag hoisting and cultural programs',
  },
  {
    title: 'Annual Sports Meet',
    date: 'Feb 10-12, 2025',
    description: 'Three-day inter-house sports competition',
  },
];

export const NoticesSection = () => {
  return (
    <section id="notices" className="section-padding bg-muted/50">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-4">
            <Bell className="w-4 h-4 inline mr-1" />
            Notices & Events
          </span>
          <h2 className="section-title">Stay Updated</h2>
          <p className="section-subtitle">
            Important announcements, upcoming events, and the latest news 
            from Lautan Ram Dropadi Devi.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Notices List */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-foreground">
                  Latest Notices
                </h3>
                <a
                  href="#"
                  className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="divide-y divide-border">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-5 hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${notice.color} flex items-center justify-center flex-shrink-0`}>
                        <notice.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {notice.category}
                              </span>
                              {notice.isNew && (
                                <span className="text-xs font-bold text-primary-foreground bg-secondary px-2 py-0.5 rounded">
                                  NEW
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {notice.title}
                            </h4>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
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

          {/* Upcoming Events */}
          <div>
            <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div
                    key={event.title}
                    className="p-4 rounded-xl bg-card border border-border hover:shadow-card transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      <span className="text-sm font-semibold text-primary">
                        {event.date}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-foreground mb-1">
                      {event.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <p className="text-sm text-foreground font-medium mb-2">
                  📅 Academic Calendar 2024-25
                </p>
                <a
                  href="#"
                  className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  Download PDF
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
