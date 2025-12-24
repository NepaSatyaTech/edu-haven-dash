import { Mail, Linkedin } from 'lucide-react';

const facultyMembers = [
  {
    name: 'Dr. Priya Sharma',
    designation: 'Head of Sciences',
    qualification: 'Ph.D. in Physics, IIT Bombay',
    initials: 'PS',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Mr. Arun Verma',
    designation: 'Senior Mathematics Teacher',
    qualification: 'M.Sc Mathematics, BHU',
    initials: 'AV',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    name: 'Mrs. Meera Nair',
    designation: 'Head of Languages',
    qualification: 'M.A. English Literature',
    initials: 'MN',
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Dr. Rajiv Gupta',
    designation: 'Computer Science HOD',
    qualification: 'Ph.D. Computer Science',
    initials: 'RG',
    color: 'from-orange-500 to-orange-600',
  },
  {
    name: 'Mrs. Sunita Devi',
    designation: 'Arts & Crafts Coordinator',
    qualification: 'M.F.A., Delhi College of Arts',
    initials: 'SD',
    color: 'from-pink-500 to-pink-600',
  },
  {
    name: 'Mr. Vijay Kumar',
    designation: 'Sports Director',
    qualification: 'M.P.Ed, National Sports Academy',
    initials: 'VK',
    color: 'from-red-500 to-red-600',
  },
  {
    name: 'Dr. Ananya Das',
    designation: 'Chemistry Teacher',
    qualification: 'Ph.D. Organic Chemistry',
    initials: 'AD',
    color: 'from-teal-500 to-teal-600',
  },
  {
    name: 'Mr. Sanjay Mehta',
    designation: 'History & Civics Teacher',
    qualification: 'M.A. History, JNU',
    initials: 'SM',
    color: 'from-amber-500 to-amber-600',
  },
];

export const FacultySection = () => {
  return (
    <section id="faculty" className="section-padding bg-muted/50">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Our Faculty
          </span>
          <h2 className="section-title">Meet Our Expert Teachers</h2>
          <p className="section-subtitle">
            Our dedicated faculty comprises highly qualified educators 
            committed to nurturing excellence in every student.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyMembers.map((member, index) => (
            <div
              key={member.name}
              className="group glass-card overflow-hidden hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
            >
              {/* Avatar */}
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-90`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-display font-bold text-white/90">
                    {member.initials}
                  </span>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Mail className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 text-center">
                <h3 className="font-display font-bold text-foreground text-lg mb-1">
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-semibold mb-2">
                  {member.designation}
                </p>
                <p className="text-muted-foreground text-xs">
                  {member.qualification}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Our faculty is always ready to help students excel.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Get in touch with our teachers
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
