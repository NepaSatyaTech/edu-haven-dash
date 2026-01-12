
-- Fix function search path for calculate_grade
CREATE OR REPLACE FUNCTION public.calculate_grade(marks_obtained DECIMAL, full_marks INTEGER)
RETURNS public.grade_type
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
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
