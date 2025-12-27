-- Create testimonials table for editable testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_ne TEXT,
  content_en TEXT NOT NULL,
  content_ne TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  initials TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view published testimonials
CREATE POLICY "Anyone can view published testimonials"
ON public.testimonials
FOR SELECT
USING (is_published = true);

-- Admins can manage testimonials
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for timestamps
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings for editable content if not exist
INSERT INTO public.site_settings (key, value_en, value_ne)
VALUES 
  ('facilities_title', 'World-Class Infrastructure', 'विश्वस्तरीय पूर्वाधार'),
  ('facilities_description', 'Our campus is equipped with modern facilities to support comprehensive learning and development of every student.', 'हाम्रो क्याम्पसमा प्रत्येक विद्यार्थीको समग्र शिक्षा र विकासको लागि आधुनिक सुविधाहरू उपलब्ध छन्।'),
  ('academics_title', 'Comprehensive Curriculum', 'समग्र पाठ्यक्रम'),
  ('academics_description', 'Our NEB-affiliated curriculum is designed to foster intellectual curiosity, critical thinking, and holistic development at every stage.', 'NEB अन्तर्गतको हाम्रो पाठ्यक्रमले हरेक तहमा बौद्धिक जिज्ञासा, समालोचनात्मक सोच र समग्र विकासलाई प्रवर्द्धन गर्छ।'),
  ('testimonials_title', 'What Our Community Says', 'हाम्रो समुदायले के भन्छ'),
  ('testimonials_description', 'Hear from parents, students, and alumni about their experience at Lautan Ram Dropadi Devi.', 'अभिभावक, विद्यार्थी, र पूर्व विद्यार्थीहरूले लौटन राम द्रोपदी देवीमा आफ्नो अनुभवबारे के भन्छन् सुन्नुहोस्।'),
  ('campus_area', '10', '१०'),
  ('classrooms_count', '40+', '४०+'),
  ('bus_routes_count', '0', '०'),
  ('cctv_count', '10+', '१०+')
ON CONFLICT (key) DO NOTHING;

-- Insert sample testimonials
INSERT INTO public.testimonials (name, role_en, role_ne, content_en, content_ne, rating, initials, display_order)
VALUES 
  ('Mrs. Sunita Kapoor', 'Parent of Grade 8 Student', 'ग्रेड ८ विद्यार्थीको अभिभावक', 'Lautan Ram Dropadi Devi has transformed my daughter''s approach to learning. The teachers are incredibly supportive, and the holistic development focus is remarkable.', 'लौटन राम द्रोपदी देवीले मेरी छोरीको सिकाइको दृष्टिकोण परिवर्तन गर्‍यो। शिक्षकहरू अत्यन्तै सहयोगी छन्, र समग्र विकासमा केन्द्रित दृष्टिकोण प्रशंसनीय छ।', 5, 'SK', 1),
  ('Rahul Sharma', 'Alumni, Batch of 2020', 'पूर्व विद्यार्थी, २०२० ब्याच', 'The foundation I received here helped me crack JEE Advanced. The faculty''s dedication and the competitive environment prepared me well for success.', 'यहाँ पाएको आधारले मलाई JEE Advanced मा सफलता हासिल गर्न मद्दत गर्‍यो। शिक्षकहरूको समर्पण र प्रतिस्पर्धात्मक वातावरणले मलाई सफलताका लागि तयार पारे।', 5, 'RS', 2),
  ('Mr. Amit Patel', 'Parent of Grade 5 & Grade 9 Students', 'ग्रेड ५ र ग्रेड ९ विद्यार्थीको अभिभावक', 'Both my children study here and the difference in their confidence and knowledge is visible. The school truly cares about each student.', 'मेरो दुबै बच्चा यहाँ पढ्छन् र उनीहरूको आत्मविश्वास र ज्ञानमा स्पष्ट फरक देखिन्छ। स्कूल साँच्चिकै प्रत्येक विद्यार्थीको ख्याल राख्छ।', 5, 'AP', 3),
  ('Priya Agarwal', 'Alumni, Batch of 2019', 'पूर्व विद्यार्थी, २०१९ ब्याच', 'The extracurricular activities and sports programs helped me discover my passion. I''m now pursuing professional athletics thanks to the exposure I got here.', 'पाठ्येतर गतिविधिहरू र खेलकुद कार्यक्रमहरूले मलाई मेरो रुचि पत्ता लगाउन मद्दत गर्‍यो। यहाँको अनुभवका कारण म अहिले पेशेवर खेलकुदमा लागिरहेको छु।', 5, 'PA', 4);