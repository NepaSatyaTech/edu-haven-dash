import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSetting {
  id: string;
  key: string;
  value_en: string;
  value_ne: string | null;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      // Convert array to object for easy access
      const settings: Record<string, SiteSetting> = {};
      data?.forEach((setting) => {
        settings[setting.key] = setting;
      });
      
      return settings;
    },
  });
};

export const useSetting = (key: string) => {
  const { data: settings, isLoading, error } = useSiteSettings();
  
  return {
    setting: settings?.[key],
    isLoading,
    error,
  };
};

export const useSettingValue = (key: string, language: 'en' | 'ne' = 'en') => {
  const { setting, isLoading } = useSetting(key);
  
  if (isLoading || !setting) {
    return { value: '', isLoading };
  }
  
  const value = language === 'ne' && setting.value_ne ? setting.value_ne : setting.value_en;
  return { value, isLoading };
};
