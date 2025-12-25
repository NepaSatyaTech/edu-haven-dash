import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'navbar';
}

export const LanguageSwitcher = ({ variant = 'default' }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ne' : 'en');
  };

  if (variant === 'navbar') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary/10"
      >
        <Globe className="h-4 w-4" />
        <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? 'नेपाली' : 'English'}
    </Button>
  );
};
