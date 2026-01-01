import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const NoticeMarquee = () => {
  const { language } = useLanguage();

  const { data: notices } = useQuery({
    queryKey: ['marquee-notices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('id, title, category, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  if (!notices || notices.length === 0) return null;

  const marqueeContent = notices.map((notice) => notice.title).join('  •  ');

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="container mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0 px-4 border-r border-primary-foreground/30">
          <Bell className="h-4 w-4" />
          <span className="font-semibold text-sm">
            {language === 'ne' ? 'सूचना' : 'Notices'}
          </span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-sm">
              {marqueeContent}  •  {marqueeContent}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
