-- Create storage bucket for student photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('students', 'students', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view student photos (public bucket)
CREATE POLICY "Student photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'students');

-- Allow authenticated admins to upload student photos
CREATE POLICY "Admins can upload student photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'students' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated admins to update student photos
CREATE POLICY "Admins can update student photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'students' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated admins to delete student photos
CREATE POLICY "Admins can delete student photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'students' 
  AND has_role(auth.uid(), 'admin'::app_role)
);