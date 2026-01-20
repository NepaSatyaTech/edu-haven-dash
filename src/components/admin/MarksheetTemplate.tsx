import { useStudentMarksheet } from '@/hooks/useStudentManagement';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { format } from 'date-fns';
import { Loader2, User } from 'lucide-react';

interface MarksheetTemplateProps {
  studentId: string;
  examId: string;
}

const MarksheetTemplate = ({ studentId, examId }: MarksheetTemplateProps) => {
  const { data: marksheetData, isLoading } = useStudentMarksheet(studentId, examId);
  const { data: settings } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!marksheetData) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load marksheet data
      </div>
    );
  }

  const { student, exam, marks } = marksheetData;

  // Calculate totals
  let totalMarks = 0;
  let totalFullMarks = 0;
  let allPassed = true;

  marks.forEach((mark) => {
    if (mark.marks_obtained !== null && mark.subjects) {
      totalMarks += Number(mark.marks_obtained);
      totalFullMarks += mark.subjects.full_marks;
      if (mark.marks_obtained < mark.subjects.pass_marks) {
        allPassed = false;
      }
    }
  });

  const percentage = totalFullMarks > 0 ? ((totalMarks / totalFullMarks) * 100).toFixed(2) : '0';
  const overallGrade = getOverallGrade(Number(percentage));
  const result = allPassed ? 'PASS' : 'FAIL';

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
      {/* Header with Logo and School Info */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex items-center justify-center gap-6 mb-3">
          {/* School Logo Placeholder */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/30">
            <span className="text-3xl">🏫</span>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">{schoolName}</h1>
            <p className="text-sm text-gray-600">{schoolAddress}</p>
            {schoolPhone && <p className="text-xs text-gray-500">Phone: {schoolPhone}</p>}
            {schoolEmail && <p className="text-xs text-gray-500">Email: {schoolEmail}</p>}
          </div>
        </div>
        <div className="bg-gray-100 py-2 px-4 inline-block rounded">
          <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">
            {exam.name}
          </h2>
          <p className="text-sm text-gray-600">Academic Year: {exam.academic_years?.name}</p>
        </div>
      </div>

      {/* Student Information with Photo */}
      <div className="flex gap-6 mb-6">
        {/* Student Photo */}
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

        {/* Student Details */}
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

      {/* Marks Table */}
      <table className="w-full border-collapse border-2 border-gray-800 mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-800 p-2 text-left font-bold">S.N.</th>
            <th className="border border-gray-800 p-2 text-left font-bold">Subject</th>
            <th className="border border-gray-800 p-2 text-center font-bold">Full Marks</th>
            <th className="border border-gray-800 p-2 text-center font-bold">Pass Marks</th>
            <th className="border border-gray-800 p-2 text-center font-bold">Marks Obtained</th>
            <th className="border border-gray-800 p-2 text-center font-bold">Grade</th>
            <th className="border border-gray-800 p-2 text-center font-bold">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {marks.length === 0 ? (
            <tr>
              <td colSpan={7} className="border border-gray-800 p-4 text-center text-gray-500">
                No marks available for this exam
              </td>
            </tr>
          ) : (
            marks.map((mark, index) => {
              const passed = mark.marks_obtained !== null && mark.subjects 
                ? mark.marks_obtained >= mark.subjects.pass_marks 
                : false;
              return (
                <tr key={mark.id}>
                  <td className="border border-gray-800 p-2 text-center">{index + 1}</td>
                  <td className="border border-gray-800 p-2 font-medium">{mark.subjects?.name}</td>
                  <td className="border border-gray-800 p-2 text-center">{mark.subjects?.full_marks}</td>
                  <td className="border border-gray-800 p-2 text-center">{mark.subjects?.pass_marks}</td>
                  <td className="border border-gray-800 p-2 text-center font-bold">
                    {mark.marks_obtained ?? '-'}
                  </td>
                  <td className="border border-gray-800 p-2 text-center font-bold">
                    {mark.grade || '-'}
                  </td>
                  <td className={`border border-gray-800 p-2 text-center font-medium ${passed ? 'text-green-700' : 'text-red-700'}`}>
                    {mark.marks_obtained !== null ? (passed ? 'Pass' : 'Fail') : '-'}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr className="bg-gray-200 font-bold">
            <td colSpan={2} className="border border-gray-800 p-2 text-right">Grand Total</td>
            <td className="border border-gray-800 p-2 text-center">{totalFullMarks}</td>
            <td className="border border-gray-800 p-2 text-center">-</td>
            <td className="border border-gray-800 p-2 text-center text-lg">{totalMarks}</td>
            <td className="border border-gray-800 p-2 text-center text-lg">{overallGrade}</td>
            <td className="border border-gray-800 p-2 text-center">-</td>
          </tr>
        </tfoot>
      </table>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border-2 border-gray-800 p-4 text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Total Marks</p>
          <p className="text-2xl font-bold">{totalMarks}/{totalFullMarks}</p>
        </div>
        <div className="border-2 border-gray-800 p-4 text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Percentage</p>
          <p className="text-2xl font-bold">{percentage}%</p>
        </div>
        <div className="border-2 border-gray-800 p-4 text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Grade</p>
          <p className="text-2xl font-bold">{overallGrade}</p>
        </div>
        <div className={`border-2 border-gray-800 p-4 text-center ${result === 'PASS' ? 'bg-green-50 border-green-700' : 'bg-red-50 border-red-700'}`}>
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Result</p>
          <p className={`text-2xl font-bold ${result === 'PASS' ? 'text-green-700' : 'text-red-700'}`}>
            {result}
          </p>
        </div>
      </div>

      {/* Grade Scale */}
      <div className="mb-8 p-4 border border-gray-300 rounded bg-gray-50">
        <h3 className="font-bold text-sm mb-2 text-gray-700">Grade Scale:</h3>
        <div className="flex flex-wrap gap-3 text-xs">
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
      <div className="flex justify-between mt-16 pt-8">
        <div className="text-center">
          <div className="border-t-2 border-gray-800 w-40 mx-auto mb-2"></div>
          <p className="text-sm font-medium">Class Teacher</p>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-800 w-40 mx-auto mb-2"></div>
          <p className="text-sm font-medium">Exam Controller</p>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-800 w-40 mx-auto mb-2"></div>
          <p className="text-sm font-medium">Principal</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pt-4 border-t-2 border-gray-300 text-xs text-gray-500">
        <p className="font-medium">This is a computer-generated marksheet. No signature required if digitally verified.</p>
        <p className="mt-1">Generated on: {format(new Date(), 'PPP p')}</p>
      </div>
    </div>
  );
};

export default MarksheetTemplate;
