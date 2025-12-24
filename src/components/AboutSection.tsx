import { Target, Eye, Heart, CheckCircle } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            About Us
          </span>
          <h2 className="section-title">A Legacy of Excellence</h2>
          <p className="section-subtitle">
            For over five decades, Sunrise Academy has been at the forefront of 
            educational excellence, nurturing generations of successful leaders.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Left - Image/Visual */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden shadow-elevated">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-12 h-12 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                    Est. 1974
                  </h3>
                  <p className="text-muted-foreground">
                    50 Years of Educational Excellence
                  </p>
                </div>
              </div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 glass-card p-6 max-w-xs animate-float">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-secondary">A+</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">CBSE Accredited</p>
                  <p className="text-sm text-muted-foreground">Top-rated Institution</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Text Content */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Where Learning Meets{' '}
              <span className="text-gradient">Innovation</span>
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Sunrise Academy stands as a beacon of academic excellence and holistic development. 
              Our institution combines time-tested educational methodologies with cutting-edge 
              technology to prepare students for the challenges of tomorrow.
            </p>
            
            {/* Features List */}
            <ul className="space-y-3">
              {[
                'State-of-the-art infrastructure and smart classrooms',
                'Experienced faculty with international training',
                'Focus on STEM education and digital literacy',
                'Strong emphasis on sports, arts, and extracurriculars',
                'Regular parent-teacher collaboration programs',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vision, Mission, Values Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Eye,
              title: 'Our Vision',
              description:
                'To be a globally recognized institution that shapes responsible citizens and innovative leaders who contribute positively to society.',
              color: 'primary',
            },
            {
              icon: Target,
              title: 'Our Mission',
              description:
                'To provide comprehensive education that develops intellectual, physical, and moral excellence while fostering creativity and critical thinking.',
              color: 'secondary',
            },
            {
              icon: Heart,
              title: 'Our Values',
              description:
                'Integrity, Excellence, Compassion, Innovation, and Respect form the pillars of our educational philosophy and institutional culture.',
              color: 'accent',
            },
          ].map((card, index) => (
            <div
              key={card.title}
              className="group glass-card p-8 hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
                  card.color === 'primary'
                    ? 'bg-primary/10'
                    : card.color === 'secondary'
                    ? 'bg-secondary/20'
                    : 'bg-accent/10'
                }`}
              >
                <card.icon
                  className={`w-7 h-7 ${
                    card.color === 'primary'
                      ? 'text-primary'
                      : card.color === 'secondary'
                      ? 'text-secondary'
                      : 'text-accent'
                  }`}
                />
              </div>
              <h4 className="text-xl font-display font-bold text-foreground mb-3">
                {card.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Principal's Message */}
        <div className="mt-20 glass-card p-8 md:p-12 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="grid md:grid-cols-[auto,1fr] gap-8 items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto md:mx-0">
              <span className="text-4xl font-display font-bold text-primary-foreground">DR</span>
            </div>
            <div>
              <blockquote className="text-lg md:text-xl text-foreground italic leading-relaxed mb-4">
                "Education is not just about acquiring knowledge; it's about developing character, 
                fostering curiosity, and preparing young minds to face life's challenges with 
                confidence and integrity. At Sunrise Academy, every child is a unique story 
                waiting to be written."
              </blockquote>
              <div>
                <p className="font-display font-bold text-foreground">Dr. Rajesh Kumar</p>
                <p className="text-muted-foreground">Principal, Sunrise Academy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
