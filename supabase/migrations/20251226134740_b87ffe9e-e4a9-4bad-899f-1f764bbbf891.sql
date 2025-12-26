-- Add passed_out_college column to faculty table
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS passed_out_college text;

-- Create storage bucket for faculty images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('faculty', 'faculty', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for faculty bucket
CREATE POLICY "Faculty images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'faculty');

CREATE POLICY "Admins can upload faculty images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'faculty' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update faculty images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'faculty' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete faculty images"
ON storage.objects FOR DELETE
USING (bucket_id = 'faculty' AND has_role(auth.uid(), 'admin'));