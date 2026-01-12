
-- Create enum for grade types
CREATE TYPE public.grade_type AS ENUM ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E');

-- Create enum for exam types
CREATE TYPE public.exam_type AS ENUM ('first_terminal', 'second_terminal', 'final');

-- Create enum for student status
CREATE TYPE public.student_status AS ENUM ('active', 'inactive', 'graduated', 'transferred');

-- Create classes table
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g., "Class 1", "Class 2"
    grade_level INTEGER NOT NULL UNIQUE CHECK (grade_level >= 1 AND grade_level <= 12),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sections table
CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "A", "B", "C"
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(class_id, name)
);

-- Create subjects table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    full_marks INTEGER NOT NULL DEFAULT 100,
    pass_marks INTEGER NOT NULL DEFAULT 32,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_subjects junction table (for class-specific subjects)
CREATE TABLE public.class_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(class_id, subject_id)
);

-- Create students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL UNIQUE, -- Auto-generated unique ID like "STU2024001"
    full_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    class_id UUID NOT NULL REFERENCES public.classes(id),
    section_id UUID NOT NULL REFERENCES public.sections(id),
    roll_number INTEGER NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    photo_url TEXT,
    status public.student_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(class_id, section_id, roll_number)
);

-- Create academic_years table
CREATE TABLE public.academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g., "2024-2025"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exams table
CREATE TABLE public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    exam_type public.exam_type NOT NULL,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    class_id UUID NOT NULL REFERENCES public.classes(id),
    start_date DATE,
    end_date DATE,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(exam_type, academic_year_id, class_id)
);

-- Create marks table
CREATE TABLE public.marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id),
    marks_obtained DECIMAL(5,2),
    grade public.grade_type,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, exam_id, subject_id)
);

-- Insert default classes
INSERT INTO public.classes (name, grade_level) VALUES
    ('Class 1', 1), ('Class 2', 2), ('Class 3', 3), ('Class 4', 4),
    ('Class 5', 5), ('Class 6', 6), ('Class 7', 7), ('Class 8', 8),
    ('Class 9', 9), ('Class 10', 10), ('Class 11', 11), ('Class 12', 12);

-- Insert default sections for each class
INSERT INTO public.sections (class_id, name)
SELECT c.id, s.name
FROM public.classes c
CROSS JOIN (VALUES ('A'), ('B')) AS s(name);

-- Insert default subjects
INSERT INTO public.subjects (name, code, full_marks, pass_marks) VALUES
    ('Nepali', 'NEP', 100, 32),
    ('English', 'ENG', 100, 32),
    ('Mathematics', 'MATH', 100, 32),
    ('Science', 'SCI', 100, 32),
    ('Social Studies', 'SOC', 100, 32),
    ('Computer Science', 'COMP', 100, 32),
    ('Moral Education', 'MORAL', 50, 16),
    ('Health & Physical Education', 'HPE', 50, 16),
    ('Optional Mathematics', 'OPT_MATH', 100, 32),
    ('Physics', 'PHY', 100, 32),
    ('Chemistry', 'CHEM', 100, 32),
    ('Biology', 'BIO', 100, 32),
    ('Accountancy', 'ACC', 100, 32);

-- Assign subjects to classes (Class 1-5: Basic subjects)
INSERT INTO public.class_subjects (class_id, subject_id)
SELECT c.id, s.id
FROM public.classes c
CROSS JOIN public.subjects s
WHERE c.grade_level BETWEEN 1 AND 5
AND s.code IN ('NEP', 'ENG', 'MATH', 'SCI', 'SOC', 'MORAL', 'HPE');

-- Assign subjects to classes (Class 6-8: Basic + Computer)
INSERT INTO public.class_subjects (class_id, subject_id)
SELECT c.id, s.id
FROM public.classes c
CROSS JOIN public.subjects s
WHERE c.grade_level BETWEEN 6 AND 8
AND s.code IN ('NEP', 'ENG', 'MATH', 'SCI', 'SOC', 'COMP', 'MORAL', 'HPE');

-- Assign subjects to classes (Class 9-10: SEE level)
INSERT INTO public.class_subjects (class_id, subject_id)
SELECT c.id, s.id
FROM public.classes c
CROSS JOIN public.subjects s
WHERE c.grade_level BETWEEN 9 AND 10
AND s.code IN ('NEP', 'ENG', 'MATH', 'SCI', 'SOC', 'COMP', 'OPT_MATH', 'HPE');

-- Assign subjects to classes (Class 11-12: Science stream as default)
INSERT INTO public.class_subjects (class_id, subject_id)
SELECT c.id, s.id
FROM public.classes c
CROSS JOIN public.subjects s
WHERE c.grade_level BETWEEN 11 AND 12
AND s.code IN ('NEP', 'ENG', 'MATH', 'PHY', 'CHEM', 'BIO', 'COMP');

-- Insert current academic year
INSERT INTO public.academic_years (name, start_date, end_date, is_current) VALUES
    ('2024-2025', '2024-04-01', '2025-03-31', true);

-- Create function to generate student ID
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    year_prefix TEXT;
    next_num INTEGER;
BEGIN
    year_prefix := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(student_id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM public.students
    WHERE student_id LIKE 'STU' || year_prefix || '%';
    
    NEW.student_id := 'STU' || year_prefix || LPAD(next_num::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$;

-- Create trigger for auto-generating student ID
CREATE TRIGGER generate_student_id_trigger
    BEFORE INSERT ON public.students
    FOR EACH ROW
    WHEN (NEW.student_id IS NULL OR NEW.student_id = '')
    EXECUTE FUNCTION public.generate_student_id();

-- Create function to auto-generate roll number
CREATE OR REPLACE FUNCTION public.generate_roll_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    next_roll INTEGER;
BEGIN
    IF NEW.roll_number IS NULL OR NEW.roll_number = 0 THEN
        SELECT COALESCE(MAX(roll_number), 0) + 1
        INTO next_roll
        FROM public.students
        WHERE class_id = NEW.class_id AND section_id = NEW.section_id;
        
        NEW.roll_number := next_roll;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for auto-generating roll number
CREATE TRIGGER generate_roll_number_trigger
    BEFORE INSERT ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_roll_number();

-- Create function to calculate grade from marks
CREATE OR REPLACE FUNCTION public.calculate_grade(marks_obtained DECIMAL, full_marks INTEGER)
RETURNS public.grade_type
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    percentage DECIMAL;
BEGIN
    IF marks_obtained IS NULL THEN
        RETURN NULL;
    END IF;
    
    percentage := (marks_obtained / full_marks) * 100;
    
    IF percentage >= 90 THEN RETURN 'A+';
    ELSIF percentage >= 80 THEN RETURN 'A';
    ELSIF percentage >= 70 THEN RETURN 'B+';
    ELSIF percentage >= 60 THEN RETURN 'B';
    ELSIF percentage >= 50 THEN RETURN 'C+';
    ELSIF percentage >= 40 THEN RETURN 'C';
    ELSIF percentage >= 32 THEN RETURN 'D+';
    ELSIF percentage >= 20 THEN RETURN 'D';
    ELSE RETURN 'E';
    END IF;
END;
$$;

-- Create trigger to auto-calculate grade when marks are entered
CREATE OR REPLACE FUNCTION public.auto_calculate_grade()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    subject_full_marks INTEGER;
BEGIN
    SELECT full_marks INTO subject_full_marks
    FROM public.subjects
    WHERE id = NEW.subject_id;
    
    NEW.grade := public.calculate_grade(NEW.marks_obtained, subject_full_marks);
    NEW.updated_at := now();
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER auto_calculate_grade_trigger
    BEFORE INSERT OR UPDATE ON public.marks
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_calculate_grade();

-- Add updated_at triggers
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exams_updated_at
    BEFORE UPDATE ON public.exams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classes (public read, admin write)
CREATE POLICY "Anyone can view classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for sections
CREATE POLICY "Anyone can view sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Admins can manage sections" ON public.sections FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for subjects
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for class_subjects
CREATE POLICY "Anyone can view class subjects" ON public.class_subjects FOR SELECT USING (true);
CREATE POLICY "Admins can manage class subjects" ON public.class_subjects FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for students
CREATE POLICY "Anyone can view students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Admins can manage students" ON public.students FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for academic_years
CREATE POLICY "Anyone can view academic years" ON public.academic_years FOR SELECT USING (true);
CREATE POLICY "Admins can manage academic years" ON public.academic_years FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for exams
CREATE POLICY "Anyone can view published exams" ON public.exams FOR SELECT USING (is_published = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage exams" ON public.exams FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for marks
CREATE POLICY "Anyone can view marks for published exams" ON public.marks FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.exams WHERE id = marks.exam_id AND is_published = true) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage marks" ON public.marks FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
