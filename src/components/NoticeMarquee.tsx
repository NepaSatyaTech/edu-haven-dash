import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bell, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Notice {
  id: string;
  title: string;
  content: string | null;
  category: string;
  created_at: string;
}

export const NoticeMarquee = () => {
  const { language } = useLanguage();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const { data: notices } = useQuery({
    queryKey: ['marquee-notices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('id, title, content, category, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Notice[];
    },
  });

  if (!notices || notices.length === 0) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleClose = () => setSelectedNotice(null);

  return (
    <>
      <div 
        className="bg-marquee-gradient text-white py-2.5 overflow-hidden shadow-md"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="container mx-auto flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0 px-4 border-r border-white/30">
            <Bell className="h-4 w-4 animate-pulse" />
            <span className="font-semibold text-sm">
              {language === 'ne' ? 'सूचना' : 'Notices'}
            </span>
          </div>
          <div className="overflow-hidden flex-1">
            <div 
              className="whitespace-nowrap animate-marquee"
              style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            >
              {notices.map((notice, index) => (
                <span key={notice.id}>
                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="text-sm font-medium hover:underline cursor-pointer transition-all hover:text-white/80"
                  >
                    {notice.title}
                  </button>
                  {index < notices.length - 1 && <span className="mx-4">•</span>}
                </span>
              ))}
              <span className="mx-4">•</span>
              {notices.map((notice, index) => (
                <span key={`dup-${notice.id}`}>
                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="text-sm font-medium hover:underline cursor-pointer transition-all hover:text-white/80"
                  >
                    {notice.title}
                  </button>
                  {index < notices.length - 1 && <span className="mx-4">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedNotice} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="relative pr-8">
            <DialogTitle className="text-xl font-display">
              {selectedNotice?.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-marquee-gradient text-white border-0">
                {selectedNotice?.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {selectedNotice && formatDate(selectedNotice.created_at)}
              </span>
            </div>
            <div className="text-foreground/80 leading-relaxed">
              {selectedNotice?.content || (
                <span className="text-muted-foreground italic">
                  {language === 'ne' ? 'कुनै थप विवरण उपलब्ध छैन।' : 'No additional details available.'}
                </span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
