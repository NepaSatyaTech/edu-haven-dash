import { Navbar } from '@/components/Navbar';
import { FacultySection } from '@/components/FacultySection';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, GraduationCap, Award, BookOpen } from 'lucide-react';

const Faculty = () => {
  const { t } = useLanguage();

  const stats = [
    { value: '100+', label: t('Total Faculty', 'कुल शिक्षकहरू'), icon: Users },
    { value: '80%', label: t('Post-Graduate', 'स्नातकोत्तर'), icon: GraduationCap },
    { value: '15+', label: t('Years Avg. Experience', 'वर्ष औसत अनुभव'), icon: Award },
    { value: '20+', label: t('Certified Trainers', 'प्रमाणित प्रशिक्षकहरू'), icon: BookOpen },
  ];

  const departments = [
    { name: t('Science Department', 'विज्ञान विभाग'), members: '15', head: t('Mr. Rajesh Kumar', 'श्री राजेश कुमार') },
    { name: t('Mathematics Department', 'गणित विभाग'), members: '12', head: t('Mrs. Sunita Devi', 'श्रीमती सुनिता देवी') },
    { name: t('Languages Department', 'भाषा विभाग'), members: '18', head: t('Mr. Anil Sharma', 'श्री अनिल शर्मा') },
    { name: t('Social Studies', 'सामाजिक अध्ययन'), members: '10', head: t('Mrs. Meera Jha', 'श्रीमती मीरा झा') },
    { name: t('Computer Science', 'कम्प्युटर विज्ञान'), members: '8', head: t('Mr. Pradeep Singh', 'श्री प्रदीप सिंह') },
    { name: t('Physical Education', 'शारीरिक शिक्षा'), members: '6', head: t('Mr. Vikash Yadav', 'श्री विकास यादव') },
  ];

  const trainingPrograms = [
    t('Annual pedagogy workshops with NCERT & NEB', 'NCERT र NEB सँग वार्षिक शिक्षाशास्त्र कार्यशालाहरू'),
    t('Digital literacy & smart classroom training', 'डिजिटल साक्षरता र स्मार्ट कक्षाकोठा तालिम'),
    t('Subject-specific refresher courses', 'विषय-विशिष्ट रिफ्रेसर कोर्सहरू'),
    t('Child psychology & inclusive education seminars', 'बाल मनोविज्ञान र समावेशी शिक्षा सेमिनारहरू'),
    t('First aid & safety training certification', 'प्राथमिक उपचार र सुरक्षा तालिम प्रमाणपत्र'),
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-20 bg-hero-gradient text-primary-foreground">
        <div className="container-custom mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-sm font-semibold mb-4">
            {t('Our Faculty', 'हाम्रो शिक्षकहरू')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('Meet Our ', 'भेट्नुहोस् हाम्रा ')}<span className="text-gradient">{t('Expert Teachers', 'विशेषज्ञ शिक्षकहरू')}</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {t('Dedicated educators committed to nurturing excellence in every student.', 'हरेक विद्यार्थीमा उत्कृष्टता विकास गर्न प्रतिबद्ध समर्पित शिक्षकहरू।')}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm">
                <s.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-display font-bold text-secondary">{s.value}</div>
                <p className="text-xs text-primary-foreground/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty Section */}
      <FacultySection />

      {/* Department Listing */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Department-wise Faculty', 'विभागीय शिक्षकहरू')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {departments.map((dept) => (
              <div key={dept.name} className="glass-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
                <h3 className="font-display font-bold text-lg mb-3">{dept.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between"><span className="text-muted-foreground">{t('Members:', 'सदस्य:')}</span><span className="font-semibold">{dept.members}</span></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">{t('HOD:', 'विभाग प्रमुख:')}</span><span className="font-semibold">{dept.head}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Staff Training Programs', 'कर्मचारी तालिम कार्यक्रमहरू')}</h2>
            <p className="section-subtitle">{t('Continuous professional development for our teachers.', 'हाम्रा शिक्षकहरूको लागि निरन्तर व्यावसायिक विकास।')}</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {trainingPrograms.map((prog, i) => (
              <div key={i} className="flex items-center gap-4 glass-card p-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent">{i + 1}</span>
                </div>
                <p className="font-medium">{prog}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Faculty;
