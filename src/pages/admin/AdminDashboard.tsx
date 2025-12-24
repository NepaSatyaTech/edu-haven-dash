import { useEffect, useState } from 'react';
import { Bell, Calendar, Image, Users, MessageSquare, FileText, TrendingUp, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  notices: number;
  events: number;
  gallery: number;
  faculty: number;
  messages: number;
  admissions: number;
  unreadMessages: number;
  pendingAdmissions: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    notices: 0,
    events: 0,
    gallery: 0,
    faculty: 0,
    messages: 0,
    admissions: 0,
    unreadMessages: 0,
    pendingAdmissions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: noticesCount },
          { count: eventsCount },
          { count: galleryCount },
          { count: facultyCount },
          { count: messagesCount },
          { count: admissionsCount },
          { count: unreadMessagesCount },
          { count: pendingAdmissionsCount },
        ] = await Promise.all([
          supabase.from('notices').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('faculty').select('*', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
          supabase.from('admission_inquiries').select('*', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false),
          supabase.from('admission_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);

        setStats({
          notices: noticesCount || 0,
          events: eventsCount || 0,
          gallery: galleryCount || 0,
          faculty: facultyCount || 0,
          messages: messagesCount || 0,
          admissions: admissionsCount || 0,
          unreadMessages: unreadMessagesCount || 0,
          pendingAdmissions: pendingAdmissionsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Notices', value: stats.notices, icon: Bell, color: 'bg-blue-500', href: '/admin/notices' },
    { name: 'Events', value: stats.events, icon: Calendar, color: 'bg-purple-500', href: '/admin/events' },
    { name: 'Gallery Images', value: stats.gallery, icon: Image, color: 'bg-amber-500', href: '/admin/gallery' },
    { name: 'Faculty Members', value: stats.faculty, icon: Users, color: 'bg-emerald-500', href: '/admin/faculty' },
    { name: 'Messages', value: stats.messages, icon: MessageSquare, color: 'bg-rose-500', href: '/admin/messages', badge: stats.unreadMessages },
    { name: 'Admissions', value: stats.admissions, icon: FileText, color: 'bg-cyan-500', href: '/admin/admissions', badge: stats.pendingAdmissions },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your school website.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <a
            key={stat.name}
            href={stat.href}
            className="group glass-card p-5 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 relative"
          >
            {stat.badge && stat.badge > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
                {stat.badge}
              </span>
            )}
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.name}</p>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/notices"
              className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <span className="font-medium text-foreground">Add New Notice</span>
              <Bell className="w-4 h-4 text-muted-foreground" />
            </a>
            <a
              href="/admin/events"
              className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <span className="font-medium text-foreground">Create Event</span>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </a>
            <a
              href="/admin/gallery"
              className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <span className="font-medium text-foreground">Upload Images</span>
              <Image className="w-4 h-4 text-muted-foreground" />
            </a>
            <a
              href="/admin/faculty"
              className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <span className="font-medium text-foreground">Manage Faculty</span>
              <Users className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>

        {/* Pending Items */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Pending Items
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div>
                <p className="font-semibold text-foreground">Unread Messages</p>
                <p className="text-sm text-muted-foreground">From contact form</p>
              </div>
              <span className="text-2xl font-display font-bold text-amber-600">
                {stats.unreadMessages}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div>
                <p className="font-semibold text-foreground">Pending Admissions</p>
                <p className="text-sm text-muted-foreground">Awaiting review</p>
              </div>
              <span className="text-2xl font-display font-bold text-blue-600">
                {stats.pendingAdmissions}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
