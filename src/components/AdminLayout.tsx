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
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        <item.icon className="w-4 h-4" />
        <span className="font-medium text-sm">{item.name}</span>
        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
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
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">Admin Panel</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-160px)]">
          {/* Dashboard */}
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === '/admin'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
            {location.pathname === '/admin' && <ChevronRight className="w-4 h-4 ml-auto" />}
          </Link>

          {/* Head Teacher Section */}
          <Collapsible open={headTeacherOpen} onOpenChange={setHeadTeacherOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Head Teacher
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${headTeacherOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 ml-2 space-y-1 border-l-2 border-border pl-2">
              {headTeacherItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Teacher Admin Section */}
          <Collapsible open={teacherOpen} onOpenChange={setTeacherOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Teacher Admin
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${teacherOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 ml-2 space-y-1 border-l-2 border-border pl-2">
              {teacherItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <div className="mb-3 px-4">
            <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-lg border-b border-border flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <Link
            to="/"
            className="text-sm text-primary font-medium hover:underline"
          >
            View Website →
          </Link>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
