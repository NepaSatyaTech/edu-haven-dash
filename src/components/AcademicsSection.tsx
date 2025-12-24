import { BookOpen, Atom, Calculator, Globe, Palette, Music, Code, Dumbbell } from 'lucide-react';

const levels = [
  {
    title: 'Primary School',
    grades: 'Grades 1-5',
    description: 'Building strong foundations with play-based learning and skill development.',
    color: 'from-green-400/20 to-green-500/10',
    border: 'border-green-400/30',
  },
  {
    title: 'Middle School',
    grades: 'Grades 6-8',
    description: 'Expanding horizons with integrated curriculum and exploratory learning.',
    color: 'from-blue-400/20 to-blue-500/10',
    border: 'border-blue-400/30',
  },
  {
    title: 'Secondary School',
    grades: 'Grades 9-10',
    description: 'Preparing for board exams with focused academics and career guidance.',
    color: 'from-purple-400/20 to-purple-500/10',
    border: 'border-purple-400/30',
  },
  {
    title: 'Higher Secondary',
    grades: 'Grades 11-12',
    description: 'Specialized streams with competitive exam preparation and skill development.',
    color: 'from-amber-400/20 to-amber-500/10',
    border: 'border-amber-400/30',
  },
];

const subjects = [
  { icon: Calculator, name: 'Mathematics', description: 'Algebra, Geometry, Calculus' },
  { icon: Atom, name: 'Science', description: 'Physics, Chemistry, Biology' },
  { icon: BookOpen, name: 'Languages', description: 'English, Hindi, Sanskrit' },
  { icon: Globe, name: 'Social Studies', description: 'History, Geography, Civics' },
  { icon: Code, name: 'Computer Science', description: 'Programming, AI, Web Dev' },
  { icon: Palette, name: 'Arts', description: 'Visual Arts, Crafts, Design' },
  { icon: Music, name: 'Music & Drama', description: 'Vocals, Instruments, Theater' },
  { icon: Dumbbell, name: 'Physical Ed', description: 'Sports, Yoga, Fitness' },
];

export const AcademicsSection = () => {
  return (
    <section id="academics" className="section-padding bg-muted/50">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Academics
          </span>
          <h2 className="section-title">Comprehensive Curriculum</h2>
          <p className="section-subtitle">
            Our CBSE-affiliated curriculum is designed to foster intellectual curiosity, 
            critical thinking, and holistic development at every stage.
          </p>
        </div>

        {/* Academic Levels */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {levels.map((level, index) => (
            <div
              key={level.title}
              className={`group relative p-6 rounded-2xl bg-gradient-to-br ${level.color} border ${level.border} backdrop-blur-sm hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2`}
            >
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card flex items-center justify-center font-display font-bold text-foreground">
                {index + 1}
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2 mt-4">
                {level.title}
              </h3>
              <p className="text-sm font-semibold text-primary mb-3">{level.grades}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {level.description}
              </p>
            </div>
          ))}
        </div>

        {/* Subjects Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-foreground text-center mb-10">
            Subjects We Offer
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {subjects.map((subject, index) => (
              <div
                key={subject.name}
                className="group glass-card p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <subject.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-display font-bold text-foreground mb-1">
                  {subject.name}
                </h4>
                <p className="text-xs text-muted-foreground">{subject.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum Highlights */}
        <div className="glass-card p-8 md:p-12 bg-gradient-to-r from-primary/5 to-accent/5">
          <h3 className="text-2xl font-display font-bold text-foreground text-center mb-8">
            Curriculum Highlights
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'CBSE Curriculum',
                points: [
                  'Aligned with NEP 2020',
                  'Competency-based learning',
                  'Regular assessments',
                  'Board exam preparation',
                ],
              },
              {
                title: 'Co-Curricular',
                points: [
                  'Robotics & AI Club',
                  'Debate & MUN',
                  'Environmental Club',
                  'Entrepreneurship Cell',
                ],
              },
              {
                title: 'Life Skills',
                points: [
                  'Leadership training',
                  'Communication skills',
                  'Financial literacy',
                  'Mental wellness programs',
                ],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-display font-bold text-foreground text-lg mb-4 pb-2 border-b border-border">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
