import { useState } from 'react';
import { FileText, ClipboardCheck, Users, CheckCircle, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const AdmissionsSection = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const steps = [
    {
      icon: FileText,
      title: t('Submit Application', 'आवेदन पेश गर्नुहोस्'),
      description: t(
        'Fill out the online application form with required documents.',
        'आवश्यक कागजातसहित अनलाइन आवेदन फारम भर्नुहोस्।'
      ),
    },
    {
      icon: ClipboardCheck,
      title: t('Entrance Test', 'प्रवेश परीक्षा'),
      description: t(
        'Appear for the age-appropriate assessment and interview.',
        'उमेरअनुसारको मूल्यांकन र अन्तर्वार्तामा सहभागी हुनुहोस्।'
      ),
    },
    {
      icon: Users,
      title: t('Counseling Session', 'परामर्श सत्र'),
      description: t(
        'Attend orientation and meet with academic counselors.',
        'ओरिएन्टेशनमा सहभागी भई शैक्षिक परामर्शदातासँग भेट गर्नुहोस्।'
      ),
    },
    {
      icon: CheckCircle,
      title: t('Confirmation', 'पुष्टिकरण'),
      description: t(
        'Complete fee payment and confirm your admission.',
        'शुल्क भुक्तानी गरी भर्ना सुनिश्चित गर्नुहोस्।'
      ),
    },
  ];

  const eligibility = [
    { grade: t('Nursery', 'नर्सरी'), age: t('3-4 years', '३–४ वर्ष') },
    { grade: t('KG', 'केजी'), age: t('4-5 years', '४–५ वर्ष') },
    { grade: t('Grade 1', 'कक्षा १'), age: t('5-6 years', '५–६ वर्ष') },
    { grade: t('Grade 2–5', 'कक्षा २–५'), age: t('Age appropriate', 'उमेरअनुसार') },
    { grade: t('Grade 6–10', 'कक्षा ६–१०'), age: t('As per transfer certificate', 'स्थानान्तरण प्रमाणपत्र अनुसार') },
    { grade: t('Grade 11–12', 'कक्षा ११–१२'), age: t('Based on Grade 10 results', 'कक्षा १० को नतिजाका आधारमा') },
  ];

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    grade: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('Inquiry Submitted!', 'अनुसन्धान पेश गरियो!'),
      description: t(
        "Thank you for your interest. We'll contact you within 24 hours.",
        'रुचिका लागि धन्यवाद। हामी २४ घण्टाभित्र सम्पर्क गर्नेछौं।'
      ),
    });
    setFormData({
      studentName: '',
      parentName: '',
      email: '',
      phone: '',
      grade: '',
      message: '',
    });
  };

  return (
    <section id="admissions" className="section-padding bg-background">
      <div className="container-custom mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            {t('Admissions', 'भर्ना')}
          </span>
          <h2 className="section-title">
            {t('Join Our Family', 'हाम्रो परिवारमा सामेल हुनुहोस्')}
          </h2>
          <p className="section-subtitle">
            {t(
              "Begin your child's journey to excellence. Our admissions process is simple and transparent.",
              'तपाईंको बालबालिकाको उज्ज्वल भविष्यको सुरुवात गर्नुहोस्। हाम्रो भर्ना प्रक्रिया सरल र पारदर्शी छ।'
            )}
          </p>
        </div>

        {/* Admission Process */}
        <div className="mb-20">
          <h3 className="text-2xl font-display font-bold text-center mb-10">
            {t('Admission Process', 'भर्ना प्रक्रिया')}
          </h3>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Eligibility */}
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">
              {t('Age Eligibility Criteria', 'उमेर योग्यता मापदण्ड')}
            </h3>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">
                    {t('Grade', 'कक्षा')}
                  </th>
                  <th className="py-3 px-4 text-left">
                    {t('Age Requirement', 'उमेर आवश्यकता')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {eligibility.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{row.grade}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inquiry Form */}
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">
              {t('Admission Inquiry', 'भर्ना जानकारी')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                required
                placeholder={t('Student Name', 'विद्यार्थीको नाम')}
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border"
              />

              <input
                required
                placeholder={t('Parent Name', 'अभिभावकको नाम')}
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border"
              />

              <input
                required
                type="email"
                placeholder={t('Email Address', 'इमेल ठेगाना')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border"
              />

              <input
                required
                placeholder={t('Phone Number', 'फोन नम्बर')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border"
              />

              <Button type="submit" variant="gold" size="lg" className="w-full gap-2">
                {t('Submit Inquiry', 'अनुसन्धान पेश गर्नुहोस्')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
