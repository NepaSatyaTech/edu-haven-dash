import { useStudentMarksheet } from '@/hooks/useStudentManagement';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

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

  return (
    <div className="bg-white p-8 print:p-4" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">🏫</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{schoolName}</h1>
            <p className="text-sm text-gray-600">{schoolAddress}</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold mt-4 text-gray-700">
          {exam.name}
        </h2>
        <p className="text-sm text-gray-500">Academic Year: {exam.academic_years?.name}</p>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="space-y-2">
          <div className="flex">
            <span className="font-semibold w-32">Student Name:</span>
            <span>{student.full_name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Student ID:</span>
            <span className="font-mono">{student.student_id}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Father's Name:</span>
            <span>{student.father_name}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex">
            <span className="font-semibold w-32">Class:</span>
            <span>{student.classes?.name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Section:</span>
            <span>{student.sections?.name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Roll Number:</span>
            <span>{student.roll_number}</span>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <table className="w-full border-collapse border border-gray-800 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-800 p-2 text-left">S.N.</th>
            <th className="border border-gray-800 p-2 text-left">Subject</th>
            <th className="border border-gray-800 p-2 text-center">Full Marks</th>
            <th className="border border-gray-800 p-2 text-center">Pass Marks</th>
            <th className="border border-gray-800 p-2 text-center">Marks Obtained</th>
            <th className="border border-gray-800 p-2 text-center">Grade</th>
            <th className="border border-gray-800 p-2 text-center">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((mark, index) => {
            const passed = mark.marks_obtained !== null && mark.subjects 
              ? mark.marks_obtained >= mark.subjects.pass_marks 
              : false;
            return (
              <tr key={mark.id}>
                <td className="border border-gray-800 p-2">{index + 1}</td>
                <td className="border border-gray-800 p-2">{mark.subjects?.name}</td>
                <td className="border border-gray-800 p-2 text-center">{mark.subjects?.full_marks}</td>
                <td className="border border-gray-800 p-2 text-center">{mark.subjects?.pass_marks}</td>
                <td className="border border-gray-800 p-2 text-center font-medium">
                  {mark.marks_obtained ?? '-'}
                </td>
                <td className="border border-gray-800 p-2 text-center font-semibold">
                  {mark.grade || '-'}
                </td>
                <td className={`border border-gray-800 p-2 text-center ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {mark.marks_obtained !== null ? (passed ? 'Pass' : 'Fail') : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-semibold">
            <td colSpan={2} className="border border-gray-800 p-2 text-right">Total</td>
            <td className="border border-gray-800 p-2 text-center">{totalFullMarks}</td>
            <td className="border border-gray-800 p-2 text-center">-</td>
            <td className="border border-gray-800 p-2 text-center">{totalMarks}</td>
            <td className="border border-gray-800 p-2 text-center">{overallGrade}</td>
            <td className="border border-gray-800 p-2 text-center">-</td>
          </tr>
        </tfoot>
      </table>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        <div className="border border-gray-800 p-4">
          <p className="text-sm text-gray-600">Percentage</p>
          <p className="text-2xl font-bold">{percentage}%</p>
        </div>
        <div className="border border-gray-800 p-4">
          <p className="text-sm text-gray-600">Grade</p>
          <p className="text-2xl font-bold">{overallGrade}</p>
        </div>
        <div className={`border border-gray-800 p-4 ${result === 'PASS' ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className="text-sm text-gray-600">Result</p>
          <p className={`text-2xl font-bold ${result === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
            {result}
          </p>
        </div>
      </div>

      {/* Grade Scale */}
      <div className="mb-8 text-xs">
        <p className="font-semibold mb-2">Grade Scale:</p>
        <div className="flex flex-wrap gap-2">
          <span>A+ (90-100)</span>
          <span>|</span>
          <span>A (80-89)</span>
          <span>|</span>
          <span>B+ (70-79)</span>
          <span>|</span>
          <span>B (60-69)</span>
          <span>|</span>
          <span>C+ (50-59)</span>
          <span>|</span>
          <span>C (40-49)</span>
          <span>|</span>
          <span>D+ (32-39)</span>
          <span>|</span>
          <span>D (20-31)</span>
          <span>|</span>
          <span>E (Below 20)</span>
        </div>
      </div>

      {/* Signatures */}
      <div className="flex justify-between mt-16 pt-8">
        <div className="text-center">
          <div className="border-t border-gray-800 w-40 mx-auto mb-2"></div>
          <p className="text-sm">Class Teacher</p>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-800 w-40 mx-auto mb-2"></div>
          <p className="text-sm">Exam Controller</p>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-800 w-40 mx-auto mb-2"></div>
          <p className="text-sm">Principal</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pt-4 border-t text-xs text-gray-500">
        <p>This is a computer-generated marksheet. No signature required if digitally verified.</p>
        <p>Generated on: {format(new Date(), 'PPP')}</p>
      </div>
    </div>
  );
};

export default MarksheetTemplate;
