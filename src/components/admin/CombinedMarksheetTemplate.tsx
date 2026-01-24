import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { format } from 'date-fns';
import { Loader2, User } from 'lucide-react';

interface CombinedMarksheetTemplateProps {
  studentId: string;
  academicYearId: string;
}

interface ExamMarks {
  examId: string;
  examName: string;
  examType: string;
  marks: {
    subjectId: string;
    subjectName: string;
    fullMarks: number;
    passMarks: number;
    marksObtained: number | null;
    grade: string | null;
  }[];
}

const CombinedMarksheetTemplate = ({ studentId, academicYearId }: CombinedMarksheetTemplateProps) => {
  const { data: settings } = useSiteSettings();

  // Fetch student with class info
  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ['student-combined', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*, classes(*), sections(*)')
        .eq('id', studentId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!studentId,
  });

  // Fetch academic year
  const { data: academicYear, isLoading: yearLoading } = useQuery({
    queryKey: ['academic-year', academicYearId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .eq('id', academicYearId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!academicYearId,
  });

  // Fetch all exams for this student's class and academic year
  const { data: exams = [], isLoading: examsLoading } = useQuery({
    queryKey: ['combined-exams', student?.class_id, academicYearId],
    queryFn: async () => {
      if (!student?.class_id) return [];
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('class_id', student.class_id)
        .eq('academic_year_id', academicYearId)
        .eq('is_published', true)
        .order('exam_type');
      if (error) throw error;
      return data;
    },
    enabled: !!student?.class_id && !!academicYearId,
  });

  // Fetch all marks for this student across all exams
  const { data: allMarks = [], isLoading: marksLoading } = useQuery({
    queryKey: ['combined-marks', studentId, exams.map(e => e.id)],
    queryFn: async () => {
      if (exams.length === 0) return [];
      const { data, error } = await supabase
        .from('marks')
        .select('*, subjects(*)')
        .eq('student_id', studentId)
        .in('exam_id', exams.map(e => e.id));
      if (error) throw error;
      return data;
    },
    enabled: exams.length > 0,
  });

  // Fetch subjects for the class
  const { data: classSubjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['class-subjects-combined', student?.class_id],
    queryFn: async () => {
      if (!student?.class_id) return [];
      const { data, error } = await supabase
        .from('class_subjects')
        .select('*, subjects(*)')
        .eq('class_id', student.class_id);
      if (error) throw error;
      return data;
    },
    enabled: !!student?.class_id,
  });

  const isLoading = studentLoading || yearLoading || examsLoading || marksLoading || subjectsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!student || !academicYear) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load marksheet data
      </div>
    );
  }

  // Organize exams by type
  const examTypeLabels: Record<string, string> = {
    'first_terminal': 'Periodic Assessment',
    'second_terminal': 'Half Yearly',
    'final': 'Yearly End Exam',
  };

  const sortedExams = [...exams].sort((a, b) => {
    const order = ['first_terminal', 'second_terminal', 'final'];
    return order.indexOf(a.exam_type) - order.indexOf(b.exam_type);
  });

  // Get unique subjects
  const subjects = classSubjects.map(cs => cs.subjects);

  // Create marks lookup
  const marksLookup = new Map<string, { marksObtained: number | null; grade: string | null }>();
  allMarks.forEach(mark => {
    const key = `${mark.exam_id}-${mark.subject_id}`;
    marksLookup.set(key, { marksObtained: mark.marks_obtained, grade: mark.grade });
  });

  // Calculate totals per exam
  const examTotals = sortedExams.map(exam => {
    let total = 0;
    let fullTotal = 0;
    let passed = true;
    subjects.forEach(subject => {
      const mark = marksLookup.get(`${exam.id}-${subject.id}`);
      if (mark?.marksObtained !== null && mark?.marksObtained !== undefined) {
        total += mark.marksObtained;
        fullTotal += subject.full_marks;
        if (mark.marksObtained < subject.pass_marks) {
          passed = false;
        }
      }
    });
    return { examId: exam.id, total, fullTotal, passed, percentage: fullTotal > 0 ? (total / fullTotal) * 100 : 0 };
  });

  // Grand total across all exams
  const grandTotal = examTotals.reduce((sum, e) => sum + e.total, 0);
  const grandFullTotal = examTotals.reduce((sum, e) => sum + e.fullTotal, 0);
  const grandPercentage = grandFullTotal > 0 ? (grandTotal / grandFullTotal) * 100 : 0;
  const allPassed = examTotals.every(e => e.passed);

  function getOverallGrade(percent: number): string {
    if (percent >= 90) return 'A+';
    if (percent >= 80) return 'A';
    if (percent >= 70) return 'B+';
    if (percent >= 60) return 'B';
    if (percent >= 50) return 'C+';
    if (percent >= 40) return 'C';
    if (percent >= 32) return 'D+';
    if (percent >= 20) return 'D';
    return 'E';
  }

  const schoolName = settings?.school_name?.value_en || 'School Name';
  const schoolAddress = settings?.address?.value_en || 'School Address';
  const schoolPhone = settings?.phone?.value_en || '';
  const schoolEmail = settings?.email?.value_en || '';

  return (
    <div className="bg-white p-8 print:p-4 text-black" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex items-center justify-center gap-6 mb-3">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-200">
            <span className="text-3xl">🏫</span>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">{schoolName}</h1>
            <p className="text-sm text-gray-600">{schoolAddress}</p>
            {schoolPhone && <p className="text-xs text-gray-500">Phone: {schoolPhone}</p>}
            {schoolEmail && <p className="text-xs text-gray-500">Email: {schoolEmail}</p>}
          </div>
        </div>
        <div className="bg-blue-50 py-2 px-4 inline-block rounded">
          <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">
            Consolidated Progress Report
          </h2>
          <p className="text-sm text-gray-600">Academic Year: {academicYear.name}</p>
        </div>
      </div>

      {/* Student Information */}
      <div className="flex gap-6 mb-6">
        <div className="flex-shrink-0">
          <div className="w-28 h-32 border-2 border-gray-800 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
            {student.photo_url ? (
              <img 
                src={student.photo_url} 
                alt={student.full_name} 
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Student Name:</span>
            <span className="font-bold text-gray-900">{student.full_name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Class:</span>
            <span className="text-gray-900">{student.classes?.name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Student ID:</span>
            <span className="font-mono text-gray-900">{student.student_id}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Section:</span>
            <span className="text-gray-900">{student.sections?.name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Father's Name:</span>
            <span className="text-gray-900">{student.father_name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Roll Number:</span>
            <span className="font-bold text-gray-900">{student.roll_number}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Mother's Name:</span>
            <span className="text-gray-900">{student.mother_name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Date of Birth:</span>
            <span className="text-gray-900">{format(new Date(student.date_of_birth), 'PPP')}</span>
          </div>
        </div>
      </div>

      {/* Combined Marks Table */}
      <table className="w-full border-collapse border-2 border-gray-800 mb-6 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-800 p-2 text-left font-bold" rowSpan={2}>S.N.</th>
            <th className="border border-gray-800 p-2 text-left font-bold" rowSpan={2}>Subject</th>
            <th className="border border-gray-800 p-2 text-center font-bold" rowSpan={2}>FM</th>
            <th className="border border-gray-800 p-2 text-center font-bold" rowSpan={2}>PM</th>
            {sortedExams.map(exam => (
              <th key={exam.id} className="border border-gray-800 p-2 text-center font-bold bg-blue-50" colSpan={2}>
                {examTypeLabels[exam.exam_type] || exam.name}
              </th>
            ))}
            <th className="border border-gray-800 p-2 text-center font-bold bg-green-50" colSpan={2}>Total</th>
          </tr>
          <tr className="bg-gray-100">
            {sortedExams.map(exam => (
              <>
                <th key={`${exam.id}-marks`} className="border border-gray-800 p-1 text-center text-xs">Marks</th>
                <th key={`${exam.id}-grade`} className="border border-gray-800 p-1 text-center text-xs">Grade</th>
              </>
            ))}
            <th className="border border-gray-800 p-1 text-center text-xs bg-green-50">Marks</th>
            <th className="border border-gray-800 p-1 text-center text-xs bg-green-50">Grade</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 ? (
            <tr>
              <td colSpan={4 + sortedExams.length * 2 + 2} className="border border-gray-800 p-4 text-center text-gray-500">
                No subjects assigned to this class
              </td>
            </tr>
          ) : (
            subjects.map((subject, index) => {
              // Calculate total for this subject across all exams
              let subjectTotal = 0;
              let subjectFullTotal = 0;
              
              sortedExams.forEach(exam => {
                const mark = marksLookup.get(`${exam.id}-${subject.id}`);
                if (mark?.marksObtained !== null && mark?.marksObtained !== undefined) {
                  subjectTotal += mark.marksObtained;
                  subjectFullTotal += subject.full_marks;
                }
              });
              
              const subjectPercentage = subjectFullTotal > 0 ? (subjectTotal / subjectFullTotal) * 100 : 0;
              const subjectGrade = getOverallGrade(subjectPercentage);

              return (
                <tr key={subject.id}>
                  <td className="border border-gray-800 p-2 text-center">{index + 1}</td>
                  <td className="border border-gray-800 p-2 font-medium">{subject.name}</td>
                  <td className="border border-gray-800 p-2 text-center">{subject.full_marks}</td>
                  <td className="border border-gray-800 p-2 text-center">{subject.pass_marks}</td>
                  {sortedExams.map(exam => {
                    const mark = marksLookup.get(`${exam.id}-${subject.id}`);
                    const passed = mark?.marksObtained !== null && mark?.marksObtained !== undefined
                      ? mark.marksObtained >= subject.pass_marks
                      : false;
                    return (
                      <>
                        <td 
                          key={`${exam.id}-${subject.id}-marks`} 
                          className={`border border-gray-800 p-2 text-center font-medium ${
                            mark?.marksObtained !== null && !passed ? 'text-red-600 bg-red-50' : ''
                          }`}
                        >
                          {mark?.marksObtained ?? '-'}
                        </td>
                        <td 
                          key={`${exam.id}-${subject.id}-grade`} 
                          className="border border-gray-800 p-2 text-center"
                        >
                          {mark?.grade || '-'}
                        </td>
                      </>
                    );
                  })}
                  <td className="border border-gray-800 p-2 text-center font-bold bg-green-50">
                    {subjectTotal > 0 ? subjectTotal : '-'}
                  </td>
                  <td className="border border-gray-800 p-2 text-center font-bold bg-green-50">
                    {subjectTotal > 0 ? subjectGrade : '-'}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr className="bg-gray-200 font-bold">
            <td colSpan={4} className="border border-gray-800 p-2 text-right">Grand Total</td>
            {sortedExams.map((exam, idx) => {
              const et = examTotals[idx];
              return (
                <>
                  <td key={`${exam.id}-total`} className="border border-gray-800 p-2 text-center">
                    {et.total}/{et.fullTotal}
                  </td>
                  <td key={`${exam.id}-grade`} className="border border-gray-800 p-2 text-center">
                    {getOverallGrade(et.percentage)}
                  </td>
                </>
              );
            })}
            <td className="border border-gray-800 p-2 text-center bg-green-100">
              {grandTotal}/{grandFullTotal}
            </td>
            <td className="border border-gray-800 p-2 text-center bg-green-100">
              {getOverallGrade(grandPercentage)}
            </td>
          </tr>
          <tr className="bg-gray-100">
            <td colSpan={4} className="border border-gray-800 p-2 text-right font-semibold">Percentage</td>
            {sortedExams.map((exam, idx) => (
              <>
                <td key={`${exam.id}-pct`} colSpan={2} className="border border-gray-800 p-2 text-center font-bold">
                  {examTotals[idx].percentage.toFixed(2)}%
                </td>
              </>
            ))}
            <td colSpan={2} className="border border-gray-800 p-2 text-center font-bold bg-green-100">
              {grandPercentage.toFixed(2)}%
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Summary */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {sortedExams.map((exam, idx) => (
          <div key={exam.id} className="border-2 border-gray-800 p-3 text-center">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
              {examTypeLabels[exam.exam_type]?.split(' ')[0] || 'Exam'}
            </p>
            <p className="text-lg font-bold">{examTotals[idx].percentage.toFixed(1)}%</p>
            <p className={`text-xs font-medium ${examTotals[idx].passed ? 'text-green-700' : 'text-red-700'}`}>
              {examTotals[idx].passed ? 'PASS' : 'FAIL'}
            </p>
          </div>
        ))}
        <div className={`border-2 p-3 text-center ${allPassed ? 'border-green-700 bg-green-50' : 'border-red-700 bg-red-50'}`}>
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Final Result</p>
          <p className="text-lg font-bold">{grandPercentage.toFixed(1)}%</p>
          <p className={`text-sm font-bold ${allPassed ? 'text-green-700' : 'text-red-700'}`}>
            {allPassed ? 'PASSED' : 'FAILED'}
          </p>
        </div>
      </div>

      {/* Grade Scale */}
      <div className="mb-6 p-3 border border-gray-300 rounded bg-gray-50">
        <h3 className="font-bold text-sm mb-2 text-gray-700">Grade Scale:</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-green-100 rounded">A+ (90-100%)</span>
          <span className="px-2 py-1 bg-green-50 rounded">A (80-89%)</span>
          <span className="px-2 py-1 bg-blue-100 rounded">B+ (70-79%)</span>
          <span className="px-2 py-1 bg-blue-50 rounded">B (60-69%)</span>
          <span className="px-2 py-1 bg-yellow-100 rounded">C+ (50-59%)</span>
          <span className="px-2 py-1 bg-yellow-50 rounded">C (40-49%)</span>
          <span className="px-2 py-1 bg-orange-100 rounded">D+ (32-39%)</span>
          <span className="px-2 py-1 bg-orange-50 rounded">D (20-31%)</span>
          <span className="px-2 py-1 bg-red-100 rounded">E (Below 20%)</span>
        </div>
      </div>

      {/* Signatures */}
      <div className="flex justify-between mt-12 pt-8">
        <div className="text-center">
          <div className="border-t-2 border-gray-800 w-36 mx-auto mb-2"></div>
          <p className="text-sm font-medium">Class Teacher</p>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-800 w-36 mx-auto mb-2"></div>
          <p className="text-sm font-medium">Exam Controller</p>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-800 w-36 mx-auto mb-2"></div>
          <p className="text-sm font-medium">Principal</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pt-4 border-t-2 border-gray-300 text-xs text-gray-500">
        <p className="font-medium">This is a computer-generated consolidated progress report.</p>
        <p className="mt-1">Generated on: {format(new Date(), 'PPP p')}</p>
      </div>
    </div>
  );
};

export default CombinedMarksheetTemplate;
