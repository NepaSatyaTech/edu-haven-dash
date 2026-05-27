import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Bell,
  Calendar,
  Image,
  Users,
  FileText,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ChevronDown,
  Settings,
  Quote,
  UserCheck,
  ClipboardList,
  BookOpen,
  Award,
  CreditCard,
  UserPlus,
  BarChart3,
  BookMarked,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const headTeacherItems = [
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  { name: 'Notices', href: '/admin/notices', icon: Bell },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Gallery', href: '/admin/gallery', icon: Image },
  { name: 'Faculty', href: '/admin/faculty', icon: Users },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Quote },
];

const teacherItems = [
  { name: 'Admissions', href: '/admin/admissions', icon: UserPlus },
  { name: 'Students', href: '/admin/students', icon: UserCheck },
  { name: 'Attendance', href: '/admin/attendance', icon: ClipboardList },
  { name: 'Attendance Reports', href: '/admin/attendance-reports', icon: BarChart3 },
  { name: 'Subjects', href: '/admin/subjects', icon: BookOpen },
  { name: 'Exams', href: '/admin/exams', icon: Award },
  { name: 'Marksheets', href: '/admin/marksheets', icon: FileText },
  { name: 'Combined Marksheet', href: '/admin/combined-marksheets', icon: BookMarked },
  { name: 'ID Cards', href: '/admin/id-cards', icon: CreditCard },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headTeacherOpen, setHeadTeacherOpen] = useState(true);
  const [teacherOpen, setTeacherOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin, isLoading } = useAuth();

  // Redirect if not authenticated or not admin
  if (!isLoading && (!user || !isAdmin)) {
    navigate('/admin/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const NavItem = ({ item }: { item: { name: string; href: string; icon: any } }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        to={item.href}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
            : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        <span>{item.name}</span>
        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-sidebar-primary-foreground/70 ml-auto" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 border-r border-sidebar-border transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--admin-sidebar-gradient)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-sidebar-primary/20 border border-sidebar-primary/30 group-hover:bg-sidebar-primary/30 transition-colors">
              <GraduationCap className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div>
              <span className="font-display font-bold text-sidebar-foreground text-sm leading-tight block">Admin Panel</span>
              <span className="text-2xs text-sidebar-foreground/50 leading-tight block">School Management</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors p-1 rounded-lg hover:bg-sidebar-accent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {/* Dashboard */}
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              location.pathname === '/admin'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            <span>Dashboard</span>
            {location.pathname === '/admin' && <div className="w-1.5 h-1.5 rounded-full bg-sidebar-primary-foreground ml-auto" />}
          </Link>

          {/* Divider */}
          <div className="pt-2 pb-1 px-3">
            <span className="text-2xs font-semibold uppercase tracking-widest text-sidebar-foreground/30">Website</span>
          </div>

          {/* Head Teacher Section */}
          <Collapsible open={headTeacherOpen} onOpenChange={setHeadTeacherOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/80 rounded-lg transition-colors">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" />
                Head Teacher
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${headTeacherOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 space-y-0.5">
              {headTeacherItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Divider */}
          <div className="pt-2 pb-1 px-3">
            <span className="text-2xs font-semibold uppercase tracking-widest text-sidebar-foreground/30">Academic</span>
          </div>

          {/* Teacher Admin Section */}
          <Collapsible open={teacherOpen} onOpenChange={setTeacherOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/80 rounded-lg transition-colors">
              <span className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                Teacher Admin
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${teacherOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 space-y-0.5">
              {teacherItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border" style={{ background: 'hsl(222 50% 10%)' }}>
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 border border-sidebar-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-sidebar-primary">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email}</p>
              <p className="text-2xs text-sidebar-foreground/40">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 admin-header flex items-center px-4 lg:px-8 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-primary font-medium hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/8"
          >
            View Website
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
