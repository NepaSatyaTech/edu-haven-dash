import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Image as ImageIcon, User, School, BarChart3 } from 'lucide-react';

interface SiteSetting {
  id: string;
  key: string;
  value_en: string;
  value_ne: string | null;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<Record<string, { en: string; ne: string }>>({});
  const [uploading, setUploading] = useState(false);

  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['admin-site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data as SiteSetting[];
    },
  });

  useEffect(() => {
    if (siteSettings) {
      const settingsMap: Record<string, { en: string; ne: string }> = {};
      siteSettings.forEach((s) => {
        settingsMap[s.key] = { en: s.value_en, ne: s.value_ne || '' };
      });
      setSettings(settingsMap);
    }
  }, [siteSettings]);

  const updateMutation = useMutation({
    mutationFn: async ({ key, value_en, value_ne }: { key: string; value_en: string; value_ne: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value_en, value_ne: value_ne || null })
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });

  const handleSave = async (key: string) => {
    try {
      await updateMutation.mutateAsync({
        key,
        value_en: settings[key]?.en || '',
        value_ne: settings[key]?.ne || '',
      });
      toast({ title: 'Setting saved successfully!' });
    } catch (error) {
      toast({ title: 'Error saving setting', variant: 'destructive' });
    }
  };

  const handleSaveAll = async () => {
    try {
      for (const key of Object.keys(settings)) {
        await updateMutation.mutateAsync({
          key,
          value_en: settings[key].en,
          value_ne: settings[key].ne,
        });
      }
      toast({ title: 'All settings saved successfully!' });
    } catch (error) {
      toast({ title: 'Error saving settings', variant: 'destructive' });
    }
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${key}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      setSettings((prev) => ({
        ...prev,
        [key]: { ...prev[key], en: publicUrl },
      }));

      await updateMutation.mutateAsync({
        key,
        value_en: publicUrl,
        value_ne: settings[key]?.ne || '',
      });

      toast({ title: 'Image uploaded successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Error uploading image', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const updateSetting = (key: string, lang: 'en' | 'ne', value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Site Settings</h1>
          <p className="text-muted-foreground">Manage website content in English and Nepali</p>
        </div>
        <Button onClick={handleSaveAll} className="gap-2">
          <Save className="h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="hero" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Hero Stats
          </TabsTrigger>
          <TabsTrigger value="school" className="gap-2">
            <School className="h-4 w-4" />
            School Info
          </TabsTrigger>
          <TabsTrigger value="headteacher" className="gap-2">
            <User className="h-4 w-4" />
            Headteacher
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
        </TabsList>

        {/* Hero Stats */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Statistics</CardTitle>
              <CardDescription>Edit the statistics shown on the homepage hero section</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              {['hero_students', 'hero_faculty', 'hero_success_rate', 'hero_years_legacy'].map((key) => (
                <div key={key} className="space-y-3">
                  <Label className="capitalize">{key.replace('hero_', '').replace('_', ' ')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground">English</span>
                      <Input
                        value={settings[key]?.en || ''}
                        onChange={(e) => updateSetting(key, 'en', e.target.value)}
                        placeholder="e.g., 750+"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">नेपाली</span>
                      <Input
                        value={settings[key]?.ne || ''}
                        onChange={(e) => updateSetting(key, 'ne', e.target.value)}
                        placeholder="e.g., ७५०+"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* School Info */}
        <TabsContent value="school" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Edit school name, address, and about section content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>School Name (English)</Label>
                <Input
                  value={settings['school_name_en']?.en || ''}
                  onChange={(e) => updateSetting('school_name_en', 'en', e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label>School Name (Nepali)</Label>
                <Input
                  value={settings['school_name_ne']?.en || ''}
                  onChange={(e) => updateSetting('school_name_ne', 'en', e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Address (English)</Label>
                  <Input
                    value={settings['school_address']?.en || ''}
                    onChange={(e) => updateSetting('school_address', 'en', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Address (Nepali)</Label>
                  <Input
                    value={settings['school_address']?.ne || ''}
                    onChange={(e) => updateSetting('school_address', 'ne', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>About Title</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">English</span>
                    <Input
                      value={settings['about_title']?.en || ''}
                      onChange={(e) => updateSetting('about_title', 'en', e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">नेपाली</span>
                    <Input
                      value={settings['about_title']?.ne || ''}
                      onChange={(e) => updateSetting('about_title', 'ne', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label>About Description</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">English</span>
                    <Textarea
                      value={settings['about_description']?.en || ''}
                      onChange={(e) => updateSetting('about_description', 'en', e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">नेपाली</span>
                    <Textarea
                      value={settings['about_description']?.ne || ''}
                      onChange={(e) => updateSetting('about_description', 'ne', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Headteacher */}
        <TabsContent value="headteacher" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Headteacher / Principal Information</CardTitle>
              <CardDescription>Edit the principal's message and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Name (English)</Label>
                  <Input
                    value={settings['headteacher_name']?.en || ''}
                    onChange={(e) => updateSetting('headteacher_name', 'en', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Name (Nepali)</Label>
                  <Input
                    value={settings['headteacher_name']?.ne || ''}
                    onChange={(e) => updateSetting('headteacher_name', 'ne', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Title (English)</Label>
                  <Input
                    value={settings['headteacher_title']?.en || ''}
                    onChange={(e) => updateSetting('headteacher_title', 'en', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Title (Nepali)</Label>
                  <Input
                    value={settings['headteacher_title']?.ne || ''}
                    onChange={(e) => updateSetting('headteacher_title', 'ne', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Message</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">English</span>
                    <Textarea
                      value={settings['headteacher_message']?.en || ''}
                      onChange={(e) => updateSetting('headteacher_message', 'en', e.target.value)}
                      rows={5}
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">नेपाली</span>
                    <Textarea
                      value={settings['headteacher_message']?.ne || ''}
                      onChange={(e) => updateSetting('headteacher_message', 'ne', e.target.value)}
                      rows={5}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images */}
        <TabsContent value="images" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Headteacher Photo</CardTitle>
                <CardDescription>Upload the headteacher/principal's photo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings['headteacher_image_url']?.en && (
                  <div className="relative aspect-square w-48 rounded-xl overflow-hidden bg-muted">
                    <img
                      src={settings['headteacher_image_url'].en}
                      alt="Headteacher"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="headteacher-image" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg hover:bg-muted transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                    </div>
                  </Label>
                  <input
                    id="headteacher-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload('headteacher_image_url', file);
                    }}
                    disabled={uploading}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>School Building Photo</CardTitle>
                <CardDescription>Upload school building image for About section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings['school_image_url']?.en && (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
                    <img
                      src={settings['school_image_url'].en}
                      alt="School Building"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="school-image" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg hover:bg-muted transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                    </div>
                  </Label>
                  <input
                    id="school-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload('school_image_url', file);
                    }}
                    disabled={uploading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
