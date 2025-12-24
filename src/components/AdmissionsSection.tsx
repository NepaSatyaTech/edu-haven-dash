import { useState } from 'react';
import { FileText, ClipboardCheck, Users, CheckCircle, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const steps = [
  {
    icon: FileText,
    title: 'Submit Application',
    description: 'Fill out the online application form with required documents.',
  },
  {
    icon: ClipboardCheck,
    title: 'Entrance Test',
    description: 'Appear for the age-appropriate assessment and interview.',
  },
  {
    icon: Users,
    title: 'Counseling Session',
    description: 'Attend orientation and meet with academic counselors.',
  },
  {
    icon: CheckCircle,
    title: 'Confirmation',
    description: 'Complete fee payment and confirm your admission.',
  },
];

const eligibility = [
  { grade: 'Nursery', age: '3-4 years' },
  { grade: 'KG', age: '4-5 years' },
  { grade: 'Grade 1', age: '5-6 years' },
  { grade: 'Grade 2-5', age: 'Age appropriate' },
  { grade: 'Grade 6-10', age: 'As per transfer certificate' },
  { grade: 'Grade 11-12', age: 'Based on Grade 10 results' },
];

export const AdmissionsSection = () => {
  const { toast } = useToast();
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
      title: 'Inquiry Submitted!',
      description: "Thank you for your interest. We'll contact you within 24 hours.",
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
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Admissions
          </span>
          <h2 className="section-title">Join Our Family</h2>
          <p className="section-subtitle">
            Begin your child's journey to excellence. Our admissions process 
            is designed to be simple and transparent.
          </p>
        </div>

        {/* Admission Process Steps */}
        <div className="relative mb-20">
          <h3 className="text-2xl font-display font-bold text-foreground text-center mb-10">
            Admission Process
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
                <div className="glass-card p-6 text-center relative z-10 hover:shadow-card-hover transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                    <step.icon className="w-7 h-7 text-primary" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-foreground mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Eligibility & Downloads */}
          <div className="space-y-8">
            {/* Eligibility Table */}
            <div className="glass-card p-6 md:p-8">
              <h3 className="text-xl font-display font-bold text-foreground mb-6">
                Age Eligibility Criteria
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-muted-foreground font-semibold">Grade</th>
                      <th className="py-3 px-4 text-muted-foreground font-semibold">Age Requirement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibility.map((row) => (
                      <tr key={row.grade} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{row.grade}</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Section */}
            <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-secondary/10 to-transparent">
              <h3 className="text-xl font-display font-bold text-foreground mb-4">
                Download Forms
              </h3>
              <p className="text-muted-foreground mb-6">
                Download the admission form and prospectus to learn more about our programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="default" className="gap-2">
                  <Download className="w-4 h-4" />
                  Admission Form
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  School Prospectus
                </Button>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-xl font-display font-bold text-foreground mb-6">
              Admission Inquiry
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Parent Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Enter parent name"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Grade Applying For *
                </label>
                <select
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="">Select Grade</option>
                  <option value="nursery">Nursery</option>
                  <option value="kg">Kindergarten</option>
                  <option value="1-5">Grade 1-5</option>
                  <option value="6-8">Grade 6-8</option>
                  <option value="9-10">Grade 9-10</option>
                  <option value="11-12">Grade 11-12</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Any specific questions or requirements..."
                />
              </div>

              <Button type="submit" variant="gold" size="lg" className="w-full gap-2">
                Submit Inquiry
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
