-- Create attendance table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id),
    section_id UUID NOT NULL REFERENCES public.sections(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'leave')),
    remarks TEXT,
    marked_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, date)
);

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attendance
CREATE POLICY "Anyone can view attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Admins can manage attendance" ON public.attendance FOR ALL 
    USING (has_role(auth.uid(), 'admin')) 
    WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON public.attendance
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add admission_id column to students to track which admission they came from
ALTER TABLE public.students ADD COLUMN admission_id UUID REFERENCES public.admission_inquiries(id);

-- Add index for faster attendance queries
CREATE INDEX idx_attendance_date ON public.attendance(date);
CREATE INDEX idx_attendance_class_date ON public.attendance(class_id, date);