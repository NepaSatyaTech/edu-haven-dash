import { ArrowRight, BookOpen, Users, Award, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl animate-pulse delay-300" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10 container-custom mx-auto px-4 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground/90 text-sm font-medium mb-8 animate-fade-up">
            <Award className="h-4 w-4 text-secondary" />
            <span>Ranked #1 in Academic Excellence 2024</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 leading-tight animate-fade-up delay-100">
            श्री लोटन राम   {' '}
            <span className="text-gradient">द्रौपदी देवी</span>{' '}
            माध्यमिक विद्यालय विजय नगर-७, गणेशपुर
          </h2>
          <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 leading-tight animate-fade-up delay-100">
            Lautan Ram {' '}
            <span className="text-gradient">Dropadi</span>{' '}
            Devi Secondary School
          </h3>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-10 font-body leading-relaxed animate-fade-up delay-200">
            Welcome to Lautan Ram Dropadi Devi Secondary School, where tradition meets innovation. 
            We nurture young minds with world-class education, holistic development, 
            and values that last a lifetime.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <Button variant="hero" size="xl" className="group">
              Apply Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroOutline" size="xl">
              <Play className="h-5 w-5" />
              Virtual Tour
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-fade-up delay-400">
            {[
              { icon: Users, value: '750+', label: 'Students' },
              { icon: BookOpen, value: '40+', label: 'Expert Faculty' },
              { icon: Award, value: '98%', label: 'Success Rate' },
              { icon: GraduationCapIcon, value: '50+', label: 'Years Legacy' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="group p-4 md:p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

function GraduationCapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}
