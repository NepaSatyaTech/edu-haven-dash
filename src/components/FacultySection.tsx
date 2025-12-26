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

  const getText = (member: any, key: string) =>
    language === 'ne'
      ? member[`${key}_ne`] || member[`${key}_en`]
      : member[`${key}_en`];

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

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

        {/* Faculty Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyMembers.map((member: any) => {
            const name = getText(member, 'name');

            return (
              <div
                key={member.id}
                className="border border-border rounded-lg bg-card overflow-hidden"
              >
                {/* PHOTO */}
                <div className="h-48 w-full bg-muted flex items-center justify-center">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-primary">
                      {getInitials(name)}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* DETAILS */}
                <div className="p-4 text-center space-y-1">
                  <h3 className="font-bold text-base">
                    {name}
                  </h3>

                  <p className="text-primary text-sm font-semibold">
                    {getText(member, 'designation')}
                  </p>

                  <p className="text-muted-foreground text-sm">
                    {getText(member, 'qualification')}
                  </p>

                  {member.email && (
                    <div className="pt-2 flex justify-center">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        <Mail className="w-4 h-4" />
                        {t('Email', 'इमेल')}
                      </a>
                    </div>
                  )}
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
