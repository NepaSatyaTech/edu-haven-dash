import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Mrs. Sunita Kapoor',
    role: 'Parent of Grade 8 Student',
    content:
      "Sunrise Academy has transformed my daughter's approach to learning. The teachers are incredibly supportive, and the holistic development focus is remarkable.",
    rating: 5,
    initials: 'SK',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Rahul Sharma',
    role: 'Alumni, Batch of 2020',
    content:
      "The foundation I received here helped me crack JEE Advanced. The faculty's dedication and the competitive environment prepared me well for success.",
    rating: 5,
    initials: 'RS',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    name: 'Mr. Amit Patel',
    role: 'Parent of Grade 5 & Grade 9 Students',
    content:
      'Both my children study here and the difference in their confidence and knowledge is visible. The school truly cares about each student.',
    rating: 5,
    initials: 'AP',
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Priya Agarwal',
    role: 'Alumni, Batch of 2019',
    content:
      "The extracurricular activities and sports programs helped me discover my passion. I'm now pursuing professional athletics thanks to the exposure I got here.",
    rating: 5,
    initials: 'PA',
    color: 'from-orange-500 to-orange-600',
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="section-title">What Our Community Says</h2>
          <p className="section-subtitle">
            Hear from parents, students, and alumni about their experience 
            at Sunrise Academy.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group glass-card p-8 hover:shadow-card-hover transition-all duration-500"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-10 h-10 text-secondary/50" />
              </div>

              {/* Content */}
              <p className="text-foreground text-lg leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center`}
                >
                  <span className="text-lg font-display font-bold text-white">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '98%', label: 'Parent Satisfaction' },
            { value: '4.9/5', label: 'Google Rating' },
            { value: '95%', label: 'Alumni Recommend' },
            { value: '500+', label: 'Reviews' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
