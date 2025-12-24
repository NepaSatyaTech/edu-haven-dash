import { 
  BookOpenCheck, 
  FlaskConical, 
  Monitor, 
  Trophy, 
  Bus, 
  Home, 
  Utensils, 
  Stethoscope,
  Wifi,
  Trees
} from 'lucide-react';

const facilities = [
  {
    icon: BookOpenCheck,
    title: 'Modern Library',
    description: 'Over 50,000 books, digital resources, and quiet study zones for focused learning.',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: FlaskConical,
    title: 'Science Labs',
    description: 'State-of-the-art Physics, Chemistry, and Biology labs with latest equipment.',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    icon: Monitor,
    title: 'Computer Lab',
    description: 'High-speed internet, latest computers, and dedicated coding stations.',
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: Trophy,
    title: 'Sports Complex',
    description: 'Indoor stadium, outdoor fields, swimming pool, and professional coaching.',
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    icon: Bus,
    title: 'Transportation',
    description: 'GPS-enabled buses covering all major routes with trained drivers.',
    color: 'bg-red-500/10 text-red-600',
  },

  {
    icon: Utensils,
    title: 'Cafeteria',
    description: 'Hygienic kitchen serving healthy, balanced meals throughout the day.',
    color: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: Stethoscope,
    title: 'Medical Room',
    description: 'Full-time nurse, first aid facilities, and regular health checkups.',
    color: 'bg-rose-500/10 text-rose-600',
  },
  {
    icon: Wifi,
    title: 'Smart Classrooms',
    description: 'Interactive boards, projectors, and high-speed WiFi in every classroom.',
    color: 'bg-cyan-500/10 text-cyan-600',
  },
  {
    icon: Trees,
    title: 'Green Campus',
    description: 'Eco-friendly campus with gardens, solar panels, and rainwater harvesting.',
    color: 'bg-green-500/10 text-green-600',
  },
];

export const FacilitiesSection = () => {
  return (
    <section id="facilities" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-4">
            Facilities
          </span>
          <h2 className="section-title">World-Class Infrastructure</h2>
          <p className="section-subtitle">
            Our campus is equipped with modern facilities to support 
            comprehensive learning and development of every student.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {facilities.map((facility, index) => (
            <div
              key={facility.title}
              className="group glass-card p-6 hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${facility.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
              >
                <facility.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground mb-2">
                {facility.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {facility.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-20 glass-card p-8 md:p-12 bg-gradient-to-r from-primary to-primary/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10', unit: 'Acres', label: 'Campus Area' },
              { value: '40+', unit: '', label: 'Classrooms' },
              { value: '0', unit: '', label: 'Bus Routes' },
              { value: '10+', unit: '', label: 'CCTV Cameras' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-1">
                  {stat.value}
                  <span className="text-lg text-primary-foreground/80">{stat.unit}</span>
                </div>
                <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
