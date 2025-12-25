-- Create site_settings table for admin-editable content
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value_en text NOT NULL,
  value_ne text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value_en, value_ne) VALUES
-- Hero stats
('hero_students', '750+', '७५०+'),
('hero_faculty', '40+', '४०+'),
('hero_success_rate', '98%', '९८%'),
('hero_years_legacy', '50+', '५०+'),
-- School info
('school_name_en', 'Shree Lautan Ram Dropadi Devi Secondary School', NULL),
('school_name_ne', 'श्री लोटन राम द्रौपदी देवी माध्यमिक विद्यालय', NULL),
('school_address', 'Bijaynagar-7, Ganeshpur', 'विजय नगर-७, गणेशपुर'),
('school_established', '1974', '१९७४'),
-- About section
('about_title', 'A Legacy of Excellence', 'उत्कृष्टताको विरासत'),
('about_description', 'For over five decades, Lautan Ram Dropadi Devi has been at the forefront of educational excellence, nurturing generations of successful leaders.', 'पाँच दशकभन्दा बढी समयदेखि, लोटन राम द्रौपदी देवी शैक्षिक उत्कृष्टताको अग्रणीमा रहेको छ, सफल नेताहरूको पुस्ताहरूलाई पालनपोषण गर्दै।'),
-- Headteacher info
('headteacher_name', 'Dr. Rajesh Kumar', 'डा. राजेश कुमार'),
('headteacher_title', 'Principal', 'प्रधानाध्यापक'),
('headteacher_message', 'Education is not just about acquiring knowledge; it''s about developing character, fostering curiosity, and preparing young minds to face life''s challenges with confidence and integrity. At Lautan Ram Dropadi Devi, every child is a unique story waiting to be written.', 'शिक्षा केवल ज्ञान प्राप्त गर्ने बारेमा मात्र होइन; यो चरित्र विकास, जिज्ञासा बढाउने, र जीवनका चुनौतीहरूको सामना गर्न आत्मविश्वास र इमानदारीका साथ युवा मनहरूलाई तयार पार्ने बारेमा हो।'),
('headteacher_image_url', '', NULL),
('school_image_url', '', NULL);

-- Add image_url column to facilities if it doesn't exist
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS bio text;