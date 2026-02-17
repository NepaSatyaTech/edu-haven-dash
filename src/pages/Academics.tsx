import { Navbar } from '@/components/Navbar';
import { AcademicsSection } from '@/components/AcademicsSection';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Download, TrendingUp, Award, Beaker, Palette, Dumbbell, BookOpen, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Academics = () => {
  const { t } = useLanguage();

  const examSystem = [
    { type: t('Periodic Assessment', 'आवधिक मूल्यांकन'), weight: '20%', desc: t('Regular class tests & assignments throughout the year.', 'वर्षभरि नियमित कक्षा परीक्षा र असाइनमेन्ट।') },
    { type: t('Half-Yearly Exam', 'अर्ध-वार्षिक परीक्षा'), weight: '30%', desc: t('Mid-term comprehensive examination for all subjects.', 'सबै विषयहरूको लागि मध्यावधि व्यापक परीक्षा।') },
    { type: t('Annual Exam', 'वार्षिक परीक्षा'), weight: '50%', desc: t('Final examination covering the entire syllabus.', 'सम्पूर्ण पाठ्यक्रम समेटेको अन्तिम परीक्षा।') },
  ];

  const specialPrograms = [
    { icon: Beaker, title: t('STEM Program', 'STEM कार्यक्रम'), desc: t('Science, Technology, Engineering & Math focus with hands-on labs and robotics.', 'विज्ञान, प्रविधि, इन्जिनियरिङ र गणित केन्द्रित प्रयोगशाला र रोबोटिक्ससहित।') },
    { icon: Dumbbell, title: t('Sports Excellence', 'खेलकुद उत्कृष्टता'), desc: t('Professional coaching in Cricket, Football, Basketball, and Athletics.', 'क्रिकेट, फुटबल, बास्केटबल, र एथलेटिक्समा पेशेवर प्रशिक्षण।') },
    { icon: Palette, title: t('Arts & Culture', 'कला र संस्कृति'), desc: t('Dance, Music, Drama, and Visual Arts programs with annual showcases.', 'नृत्य, संगीत, नाटक, र दृश्य कला कार्यक्रमहरू वार्षिक प्रदर्शनीसहित।') },
    { icon: BookOpen, title: t('Language Lab', 'भाषा प्रयोगशाला'), desc: t('Advanced English communication, Hindi, and Sanskrit learning programs.', 'उन्नत अंग्रेजी सञ्चार, हिन्दी, र संस्कृत शिक्षण कार्यक्रमहरू।') },
  ];

  const calendarEvents = [
    { month: t('April', 'बैशाख'), event: t('New Academic Session Begins', 'नयाँ शैक्षिक सत्र सुरु') },
    { month: t('July', 'साउन'), event: t('First Periodic Assessment', 'पहिलो आवधिक मूल्यांकन') },
    { month: t('September', 'असोज'), event: t('Half-Yearly Examination', 'अर्ध-वार्षिक परीक्षा') },
    { month: t('November', 'मंसिर'), event: t('Second Periodic Assessment', 'दोस्रो आवधिक मूल्यांकन') },
    { month: t('February', 'फागुन'), event: t('Pre-Board / Annual Exam', 'प्रि-बोर्ड / वार्षिक परीक्षा') },
    { month: t('March', 'चैत'), event: t('Result Declaration & Promotion', 'नतिजा घोषणा र बढुवा') },
  ];

  const highlights = [
    { value: '98%', label: t('Board Pass Rate', 'बोर्ड उत्तीर्ण दर') },
    { value: '15+', label: t('Board Toppers', 'बोर्ड टपरहरू') },
    { value: '100%', label: t('Science Stream Pass', 'विज्ञान संकाय उत्तीर्ण') },
    { value: '50+', label: t('Scholarship Winners', 'छात्रवृत्ति विजेता') },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-20 bg-hero-gradient text-primary-foreground">
        <div className="container-custom mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-sm font-semibold mb-4">
            {t('Academics', 'शैक्षिक')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('Comprehensive ', 'समग्र ')}<span className="text-gradient">{t('Education', 'शिक्षा')}</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {t('NEB-affiliated curriculum designed to foster intellectual curiosity, critical thinking, and holistic development.', 'बौद्धिक जिज्ञासा, समालोचनात्मक सोच, र समग्र विकास प्रवर्द्धन गर्न डिजाइन गरिएको NEB सम्बन्धित पाठ्यक्रम।')}
          </p>
        </div>
      </div>

      {/* Main Academics Section */}
      <AcademicsSection />

      {/* Exam System */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Examination System', 'परीक्षा प्रणाली')}</h2>
            <p className="section-subtitle">{t('Our comprehensive assessment approach ensures continuous student evaluation.', 'हाम्रो व्यापक मूल्यांकन दृष्टिकोणले निरन्तर विद्यार्थी मूल्यांकन सुनिश्चित गर्छ।')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {examSystem.map((exam, i) => (
              <div key={exam.type} className="glass-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold">{exam.type}</h3>
                    <span className="text-sm text-secondary font-bold">{t('Weightage: ', 'भार: ')}{exam.weight}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{exam.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Special Programs', 'विशेष कार्यक्रमहरू')}</h2>
            <p className="section-subtitle">{t('Beyond academics — nurturing talent in every dimension.', 'शिक्षाभन्दा पर — हरेक आयाममा प्रतिभा विकास।')}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {specialPrograms.map((program) => (
              <div key={program.title} className="glass-card p-6 flex gap-4 items-start hover:shadow-card-hover transition-all">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <program.icon className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-1">{program.title}</h3>
                  <p className="text-sm text-muted-foreground">{program.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Calendar */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Academic Calendar', 'शैक्षिक पात्रो')}</h2>
          </div>
          <div className="max-w-3xl mx-auto glass-card overflow-hidden">
            {calendarEvents.map((event, i) => (
              <div key={event.month} className={`flex items-center gap-4 p-5 ${i !== calendarEvents.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/50 transition-colors`}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-primary">{event.month}</span>
                  <p className="font-semibold">{event.event}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              {t('Download Full Calendar (PDF)', 'पूर्ण पात्रो डाउनलोड गर्नुहोस् (PDF)')}
            </Button>
          </div>
        </div>
      </section>

      {/* Student Performance */}
      <section className="section-padding bg-hero-gradient text-primary-foreground">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t('Student Performance Highlights', 'विद्यार्थी प्रदर्शन हाइलाइट्स')}</h2>
          <p className="text-primary-foreground/70 mb-10 max-w-xl mx-auto">{t('Our students consistently achieve outstanding results.', 'हाम्रा विद्यार्थीहरूले निरन्तर उत्कृष्ट नतिजा हासिल गर्छन्।')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {highlights.map((h) => (
              <div key={h.label} className="p-6 rounded-xl bg-primary-foreground/5 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-display font-bold text-secondary">{h.value}</div>
                <p className="text-sm text-primary-foreground/70 mt-1">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Academics;
