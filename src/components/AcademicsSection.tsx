import {
  BookOpen,
  Atom,
  Calculator,
  Globe,
  Palette,
  Music,
  Code,
  Dumbbell,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const AcademicsSection = () => {
  const { t } = useLanguage();

  const levels = [
    {
      title: t('Primary School', 'प्राथमिक तह'),
      grades: t('Grades 1-5', 'कक्षा १–५'),
      description: t(
        'Building strong foundations with play-based learning and skill development.',
        'खेलमुखी सिकाइ र सीप विकासमार्फत बलियो आधार निर्माण।'
      ),
      color: 'from-green-400/20 to-green-500/10',
      border: 'border-green-400/30',
    },
    {
      title: t('Middle School', 'निम्न माध्यमिक तह'),
      grades: t('Grades 6-8', 'कक्षा ६–८'),
      description: t(
        'Expanding horizons with integrated curriculum and exploratory learning.',
        'एकीकृत पाठ्यक्रम र खोजमूलक सिकाइमार्फत ज्ञान विस्तार।'
      ),
      color: 'from-blue-400/20 to-blue-500/10',
      border: 'border-blue-400/30',
    },
    {
      title: t('Secondary School', 'माध्यमिक तह'),
      grades: t('Grades 9-10', 'कक्षा ९–१०'),
      description: t(
        'Preparing for board exams with focused academics and career guidance.',
        'केन्द्रित अध्ययन र करियर मार्गदर्शनसहित बोर्ड परीक्षाको तयारी।'
      ),
      color: 'from-purple-400/20 to-purple-500/10',
      border: 'border-purple-400/30',
    },
    {
      title: t('Higher Secondary', 'उच्च माध्यमिक तह'),
      grades: t('Grades 11-12', 'कक्षा ११–१२'),
      description: t(
        'Specialized streams with competitive exam preparation and skill development.',
        'प्रतिस्पर्धात्मक परीक्षा तयारीसहित विशेष विषय अध्ययन।'
      ),
      color: 'from-amber-400/20 to-amber-500/10',
      border: 'border-amber-400/30',
    },
  ];

  const subjects = [
    {
      icon: Calculator,
      name: t('Mathematics', 'गणित'),
      description: t('Algebra, Geometry, Calculus', 'बीजगणित, ज्यामिति, क्याल्कुलस'),
    },
    {
      icon: Atom,
      name: t('Science', 'विज्ञान'),
      description: t('Physics, Chemistry, Biology', 'भौतिक, रसायन, जीवविज्ञान'),
    },
    {
      icon: BookOpen,
      name: t('Languages', 'भाषा'),
      description: t('English, Hindi, Sanskrit', 'अंग्रेजी, हिन्दी, संस्कृत'),
    },
    {
      icon: Globe,
      name: t('Social Studies', 'सामाजिक अध्ययन'),
      description: t('History, Geography, Civics', 'इतिहास, भूगोल, नागरिकशास्त्र'),
    },
    {
      icon: Code,
      name: t('Computer Science', 'कम्प्युटर विज्ञान'),
      description: t('Programming, AI, Web Dev', 'प्रोग्रामिङ, एआई, वेब विकास'),
    },
    {
      icon: Palette,
      name: t('Arts', 'कला'),
      description: t('Visual Arts, Crafts, Design', 'चित्रकला, हस्तकला, डिजाइन'),
    },
    {
      icon: Music,
      name: t('Music & Drama', 'संगीत र नाटक'),
      description: t('Vocals, Instruments, Theater', 'गायन, वाद्ययन्त्र, नाट्य'),
    },
    {
      icon: Dumbbell,
      name: t('Physical Education', 'शारीरिक शिक्षा'),
      description: t('Sports, Yoga, Fitness', 'खेलकुद, योग, फिटनेस'),
    },
  ];

  return (
    <section id="academics" className="section-padding bg-muted/50">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            {t('Academics', 'शैक्षिक कार्यक्रम')}
          </span>
          <h2 className="section-title">
            {t('Comprehensive Curriculum', 'समग्र पाठ्यक्रम')}
          </h2>
          <p className="section-subtitle">
            {t(
              'Our NEB-affiliated curriculum is designed to foster intellectual curiosity, critical thinking, and holistic development at every stage.',
              'NEB अन्तर्गतको हाम्रो पाठ्यक्रमले हरेक तहमा बौद्धिक जिज्ञासा, समालोचनात्मक सोच र समग्र विकासलाई प्रवर्द्धन गर्छ।'
            )}
          </p>
        </div>

        {/* Academic Levels */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {levels.map((level, index) => (
            <div
              key={index}
              className={`group relative p-6 rounded-2xl bg-gradient-to-br ${level.color} border ${level.border} backdrop-blur-sm hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2`}
            >
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card flex items-center justify-center font-display font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-display font-bold mb-2 mt-4">
                {level.title}
              </h3>
              <p className="text-sm font-semibold text-primary mb-3">
                {level.grades}
              </p>
              <p className="text-muted-foreground text-sm">
                {level.description}
              </p>
            </div>
          ))}
        </div>

        {/* Subjects */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-center mb-10">
            {t('Subjects We Offer', 'हामीले उपलब्ध गराउने विषयहरू')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="group glass-card p-6 text-center hover:shadow-card-hover transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <subject.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-display font-bold mb-1">
                  {subject.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {subject.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
