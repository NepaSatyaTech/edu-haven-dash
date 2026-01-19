import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminAdmissions from "./pages/admin/AdminAdmissions";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminExams from "./pages/admin/AdminExams";
import AdminMarksEntry from "./pages/admin/AdminMarksEntry";
import AdminMarksheets from "./pages/admin/AdminMarksheets";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="notices" element={<AdminNotices />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="faculty" element={<AdminFaculty />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="admissions" element={<AdminAdmissions />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="attendance" element={<AdminAttendance />} />
                <Route path="subjects" element={<AdminSubjects />} />
                <Route path="exams" element={<AdminExams />} />
                <Route path="marks" element={<AdminMarksEntry />} />
                <Route path="marksheets" element={<AdminMarksheets />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
