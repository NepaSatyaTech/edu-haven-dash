import { Navbar } from '@/components/Navbar';
import { AdmissionsSection } from '@/components/AdmissionsSection';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, HelpCircle, Phone, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Admissions = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const documents = [
    t('Birth Certificate (Original & Photocopy)', 'जन्म प्रमाणपत्र (सक्कल र प्रतिलिपि)'),
    t('Transfer Certificate from previous school', 'अघिल्लो विद्यालयको स्थानान्तरण प्रमाणपत्र'),
    t('Previous year marksheet / Report Card', 'अघिल्लो वर्षको अंकपत्र / रिपोर्ट कार्ड'),
    t('4 passport-sized photographs', '४ वटा पासपोर्ट साइजका फोटो'),
    t("Parent/Guardian's ID proof (Citizenship)", 'अभिभावकको परिचयपत्र (नागरिकता)'),
    t('Address proof (Utility bill / Rental agreement)', 'ठेगाना प्रमाण (बिजुली बिल / भाडा सम्झौता)'),
    t('Caste certificate (if applicable)', 'जाति प्रमाणपत्र (लागू भएमा)'),
    t('Medical fitness certificate', 'स्वास्थ्य फिटनेस प्रमाणपत्र'),
  ];

  const fees = [
    { level: t('Nursery – KG', 'नर्सरी – केजी'), admission: '₹5,000', monthly: '₹2,000' },
    { level: t('Grade 1–5', 'कक्षा १–५'), admission: '₹8,000', monthly: '₹2,500' },
    { level: t('Grade 6–8', 'कक्षा ६–८'), admission: '₹10,000', monthly: '₹3,000' },
    { level: t('Grade 9–10', 'कक्षा ९–१०'), admission: '₹12,000', monthly: '₹3,500' },
    { level: t('Grade 11–12', 'कक्षा ११–१२'), admission: '₹15,000', monthly: '₹4,000' },
  ];

  const faqs = [
    {
      q: t('When does the admission process start?', 'भर्ना प्रक्रिया कहिले सुरु हुन्छ?'),
      a: t('Admissions usually open in January-February for the upcoming academic session starting in April.', 'भर्ना सामान्यतया जनवरी-फेब्रुअरीमा खुल्छ, अप्रिलमा सुरु हुने शैक्षिक सत्रको लागि।'),
    },
    {
      q: t('Is there an entrance test?', 'प्रवेश परीक्षा छ?'),
      a: t('Yes, for Grade 1 and above, an age-appropriate assessment is conducted to evaluate the student\'s academic level.', 'हो, कक्षा १ र माथिका लागि, विद्यार्थीको शैक्षिक स्तर मूल्यांकन गर्न उमेर-उपयुक्त परीक्षा लिइन्छ।'),
    },
    {
      q: t('Are scholarships available?', 'छात्रवृत्ति उपलब्ध छ?'),
      a: t('Yes, merit-based and need-based scholarships are available for deserving students. Contact the admission office for details.', 'हो, योग्य विद्यार्थीहरूका लागि योग्यतामा आधारित र आवश्यकतामा आधारित छात्रवृत्ति उपलब्ध छन्।'),
    },
    {
      q: t('Can I pay fees in installments?', 'शुल्क किस्तामा तिर्न सकिन्छ?'),
      a: t('Yes, fee installment options are available. Please discuss with our accounts department for a customized payment plan.', 'हो, शुल्क किस्ता विकल्पहरू उपलब्ध छन्। अनुकूलित भुक्तानी योजनाको लागि कृपया हाम्रो लेखा विभागसँग छलफल गर्नुहोस्।'),
    },
    {
      q: t('Is transportation facility available?', 'परिवहन सुविधा उपलब्ध छ?'),
      a: t('Yes, school buses cover major routes. Additional transport charges apply based on distance.', 'हो, विद्यालयका बसहरू प्रमुख मार्गहरूमा चल्छन्। दूरीको आधारमा थप परिवहन शुल्क लाग्छ।'),
    },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-20 bg-hero-gradient text-primary-foreground">
        <div className="container-custom mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-sm font-semibold mb-4">
            {t('Admissions Open', 'भर्ना खुला')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('Join Our ', 'हाम्रो ')}<span className="text-gradient">{t('Family', 'परिवारमा सामेल हुनुहोस्')}</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {t('Simple and transparent admission process. Start your child\'s journey to excellence today.', 'सरल र पारदर्शी भर्ना प्रक्रिया। आज नै तपाईंको बालबालिकाको उत्कृष्टताको यात्रा सुरु गर्नुहोस्।')}
          </p>
        </div>
      </div>

      {/* Admission Form & Process */}
      <AdmissionsSection />

      {/* Required Documents */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Required Documents', 'आवश्यक कागजातहरू')}</h2>
            <p className="section-subtitle">{t('Please keep the following documents ready for admission.', 'कृपया भर्ना प्रक्रियाको लागि निम्न कागजातहरू तयार राख्नुहोस्।')}</p>
          </div>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-3">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-start gap-3 glass-card p-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-medium">{doc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Fee Structure', 'शुल्क संरचना')}</h2>
            <p className="section-subtitle">{t('Affordable and transparent fee structure.', 'सस्तो र पारदर्शी शुल्क संरचना।')}</p>
          </div>
          <div className="max-w-3xl mx-auto glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/5 border-b border-border">
                  <th className="py-4 px-6 text-left font-display font-bold">{t('Level', 'तह')}</th>
                  <th className="py-4 px-6 text-left font-display font-bold">{t('Admission Fee', 'भर्ना शुल्क')}</th>
                  <th className="py-4 px-6 text-left font-display font-bold">{t('Monthly Fee', 'मासिक शुल्क')}</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee, i) => (
                  <tr key={fee.level} className={`border-b border-border hover:bg-muted/50 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="py-3 px-6 font-medium">{fee.level}</td>
                    <td className="py-3 px-6 text-primary font-semibold">{fee.admission}</td>
                    <td className="py-3 px-6 text-primary font-semibold">{fee.monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-secondary/10 text-sm text-muted-foreground">
              * {t('Fees are subject to revision. Additional charges may apply for transport, lab, and library.', 'शुल्कहरू परिवर्तन हुन सक्छन्। परिवहन, प्रयोगशाला, र पुस्तकालयका लागि थप शुल्क लाग्न सक्छ।')}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('Frequently Asked Questions', 'बारम्बार सोधिने प्रश्नहरू')}</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-display font-bold pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-hero-gradient text-primary-foreground">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t('Need Help with Admissions?', 'भर्नामा सहयोग चाहिन्छ?')}</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">{t('Our admission counselors are ready to assist you.', 'हाम्रो भर्ना परामर्शदाताहरू तपाईंलाई सहयोग गर्न तयार छन्।')}</p>
          <Button variant="gold" size="lg" className="gap-2" onClick={() => window.location.href = '/contact'}>
            <Phone className="w-5 h-5" />
            {t('Contact Admission Counselor', 'भर्ना परामर्शदातालाई सम्पर्क गर्नुहोस्')}
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Admissions;
