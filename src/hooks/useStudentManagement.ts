import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Student {
  id: string;
  student_id: string;
  full_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  class_id: string;
  section_id: string;
  roll_number: number;
  phone: string | null;
  email: string | null;
  address: string | null;
  photo_url: string | null;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  created_at: string;
  updated_at: string;
  classes?: { id: string; name: string; grade_level: number };
  sections?: { id: string; name: string };
}

export interface Class {
  id: string;
  name: string;
  grade_level: number;
}

export interface Section {
  id: string;
  class_id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  full_marks: number;
  pass_marks: number;
}

export interface ClassSubject {
  id: string;
  class_id: string;
  subject_id: string;
  subjects: Subject;
}

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Exam {
  id: string;
  name: string;
  exam_type: 'first_terminal' | 'second_terminal' | 'final';
  academic_year_id: string;
  class_id: string;
  start_date: string | null;
  end_date: string | null;
  is_published: boolean;
  academic_years?: AcademicYear;
  classes?: Class;
}

export interface Mark {
  id: string;
  student_id: string;
  exam_id: string;
  subject_id: string;
  marks_obtained: number | null;
  grade: string | null;
  remarks: string | null;
  subjects?: Subject;
}

// Classes
export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('grade_level');
      if (error) throw error;
      return data as Class[];
    },
  });
};

// Sections
export const useSections = (classId?: string) => {
  return useQuery({
    queryKey: ['sections', classId],
    queryFn: async () => {
      let query = supabase.from('sections').select('*');
      if (classId) {
        query = query.eq('class_id', classId);
      }
      const { data, error } = await query.order('name');
      if (error) throw error;
      return data as Section[];
    },
  });
};

// Subjects for a class
export const useClassSubjects = (classId?: string) => {
  return useQuery({
    queryKey: ['class-subjects', classId],
    queryFn: async () => {
      if (!classId) return [];
      const { data, error } = await supabase
        .from('class_subjects')
        .select('*, subjects(*)')
        .eq('class_id', classId);
      if (error) throw error;
      return data as ClassSubject[];
    },
    enabled: !!classId,
  });
};

// All subjects
export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Subject[];
    },
  });
};

// Academic Years
export const useAcademicYears = () => {
  return useQuery({
    queryKey: ['academic-years'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .order('start_date', { ascending: false });
      if (error) throw error;
      return data as AcademicYear[];
    },
  });
};

// Students
export const useStudents = (classId?: string, sectionId?: string, search?: string) => {
  return useQuery({
    queryKey: ['students', classId, sectionId, search],
    queryFn: async () => {
      let query = supabase
        .from('students')
        .select('*, classes(*), sections(*)')
        .order('roll_number');
      
      if (classId) {
        query = query.eq('class_id', classId);
      }
      if (sectionId) {
        query = query.eq('section_id', sectionId);
      }
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,student_id.ilike.%${search}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Student[];
    },
  });
};

// Single Student
export const useStudent = (studentId?: string) => {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!studentId) return null;
      const { data, error } = await supabase
        .from('students')
        .select('*, classes(*), sections(*)')
        .eq('id', studentId)
        .maybeSingle();
      if (error) throw error;
      return data as Student | null;
    },
    enabled: !!studentId,
  });
};

// Create Student
export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (student: { full_name: string; father_name: string; mother_name: string; date_of_birth: string; class_id: string; section_id: string; phone?: string | null; email?: string | null; address?: string | null; status: 'active' | 'inactive' | 'graduated' | 'transferred' }) => {
      const { data, error } = await supabase
        .from('students')
        .insert([student])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student registered successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to register student: ${error.message}`);
    },
  });
};

// Update Student
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...student }: Partial<Student> & { id: string }) => {
      const { data, error } = await supabase
        .from('students')
        .update(student)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
      toast.success('Student updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update student: ${error.message}`);
    },
  });
};

// Delete Student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete student: ${error.message}`);
    },
  });
};

// Exams
export const useExams = (classId?: string, academicYearId?: string) => {
  return useQuery({
    queryKey: ['exams', classId, academicYearId],
    queryFn: async () => {
      let query = supabase
        .from('exams')
        .select('*, academic_years(*), classes(*)')
        .order('created_at', { ascending: false });
      
      if (classId) {
        query = query.eq('class_id', classId);
      }
      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Exam[];
    },
  });
};

// Create Exam
export const useCreateExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (exam: Omit<Exam, 'id' | 'created_at' | 'updated_at' | 'academic_years' | 'classes'>) => {
      const { data, error } = await supabase
        .from('exams')
        .insert([exam])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Exam created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create exam: ${error.message}`);
    },
  });
};

// Update Exam
export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...exam }: Partial<Exam> & { id: string }) => {
      const { data, error } = await supabase
        .from('exams')
        .update(exam)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Exam updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update exam: ${error.message}`);
    },
  });
};

// Delete Exam
export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Exam deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete exam: ${error.message}`);
    },
  });
};

// Marks
export const useMarks = (examId?: string, studentId?: string) => {
  return useQuery({
    queryKey: ['marks', examId, studentId],
    queryFn: async () => {
      let query = supabase
        .from('marks')
        .select('*, subjects(*)');
      
      if (examId) {
        query = query.eq('exam_id', examId);
      }
      if (studentId) {
        query = query.eq('student_id', studentId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Mark[];
    },
    enabled: !!examId || !!studentId,
  });
};

// Save Marks (upsert)
export const useSaveMarks = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (marks: Array<{ student_id: string; exam_id: string; subject_id: string; marks_obtained: number | null; remarks?: string }>) => {
      const { data, error } = await supabase
        .from('marks')
        .upsert(marks, { onConflict: 'student_id,exam_id,subject_id' })
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marks'] });
      toast.success('Marks saved successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save marks: ${error.message}`);
    },
  });
};

// Student Marksheet Data
export const useStudentMarksheet = (studentId?: string, examId?: string) => {
  return useQuery({
    queryKey: ['marksheet', studentId, examId],
    queryFn: async () => {
      if (!studentId || !examId) return null;
      
      // Get student info
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*, classes(*), sections(*)')
        .eq('id', studentId)
        .single();
      if (studentError) throw studentError;
      
      // Get exam info
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .select('*, academic_years(*), classes(*)')
        .eq('id', examId)
        .single();
      if (examError) throw examError;
      
      // Get marks with subjects
      const { data: marks, error: marksError } = await supabase
        .from('marks')
        .select('*, subjects(*)')
        .eq('student_id', studentId)
        .eq('exam_id', examId);
      if (marksError) throw marksError;
      
      return { student, exam, marks };
    },
    enabled: !!studentId && !!examId,
  });
};
