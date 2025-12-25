import { Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export const FacultySection = () => {
  const { language, t } = useLanguage();

  const { data: facultyMembers = [] } = useQuery({
    queryKey: ['faculty-public', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const getText = (member: any, key: string) => {
    return language === 'ne'
      ? member[`${key}_ne`] || member[`${key}_en`]
      : member[`${key}_en`];
  };

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const colors = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-red-500 to-red-600',
    'from-teal-500 to-teal-600',
    'from-amber-500 to-amber-600',
  ];

  return (
    <section id="faculty" className="section-padding bg-muted/50">
      <div className="container-custom mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {t('Our Faculty', 'हाम्रो शिक्षकहरू')}
          </span>
          <h2 className="section-title">
            {t('Meet Our Expert Teachers', 'हाम्रा विशेषज्ञ शिक्षकहरूलाई भेट्नुहोस्')}
          </h2>
          <p className="section-subtitle">
            {t(
              'Our dedicated faculty comprises highly qualified educators committed to nurturing excellence in every student.',
              'हाम्रो समर्पित शिक्षकहरू उच्च योग्यता प्राप्त शिक्षाविद्हरू हुन् जसले हरेक विद्यार्थीको उत्कृष्टता विकास गर्छन्।'
            )}
          </p>
        </div>

        {/* Faculty Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyMembers.map((member: any, index: number) => {
            const name = getText(member, 'name');

            return (
              <div
                key={member.id}
                className="group glass-card overflow-hidden hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                          colors[index % colors.length]
                        } opacity-90`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-display font-bold text-white/90">
                          {getInitials(name)}
                        </span>
                      </div>
                    </>
                  )}

                  {member.email && (
                    <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-5 text-center">
                  <h3 className="font-display font-bold text-lg mb-1">
                    {name}
                  </h3>
                  <p className="text-primary text-sm font-semibold mb-2">
                    {getText(member, 'designation')}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {getText(member, 'qualification')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            {t(
              'Our faculty is always ready to help students excel.',
              'हाम्रो शिक्षकहरू विद्यार्थीहरूलाई उत्कृष्ट बनाउन सधैं तत्पर छन्।'
            )}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            {t(
              'Get in touch with our teachers',
              'हाम्रा शिक्षकहरूसँग सम्पर्क गर्नुहोस्'
            )}
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
