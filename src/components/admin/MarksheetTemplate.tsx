import { useStudentMarksheet } from '@/hooks/useStudentManagement';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { format } from 'date-fns';
import { Loader2, Printer } from 'lucide-react';

interface MarksheetTemplateProps {
  studentId: string;
  examId: string;
}

const MarksheetTemplate = ({ studentId, examId }: MarksheetTemplateProps) => {
  const { data: marksheetData, isLoading } = useStudentMarksheet(studentId, examId);
  const { data: settings } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!marksheetData) {
    return <div className="text-center py-12">Failed to load marksheet</div>;
  }

  const { student, exam, marks } = marksheetData;

  let totalMarks = 0;
  let totalFullMarks = 0;
  let allPassed = true;

  marks.forEach((m) => {
    if (m.marks_obtained !== null && m.subjects) {
      totalMarks += Number(m.marks_obtained);
      totalFullMarks += m.subjects.full_marks;
      if (m.marks_obtained < m.subjects.pass_marks) allPassed = false;
    }
  });

  const percentage = ((totalMarks / totalFullMarks) * 100).toFixed(2);
  const result = allPassed ? 'PASS' : 'FAIL';

  const getGrade = (p: number) => {
    if (p >= 90) return 'A+';
    if (p >= 80) return 'A';
    if (p >= 70) return 'B+';
    if (p >= 60) return 'B';
    if (p >= 50) return 'C+';
    if (p >= 40) return 'C';
    if (p >= 32) return 'D+';
    return 'E';
  };

  const overallGrade = getGrade(Number(percentage));

  return (
    <>
      {/* PRINT BUTTON */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          <Printer size={18} />
          Print Marksheet
        </button>
      </div>

      {/* MARKSHEET PAGE */}
      <div
        className="mx-auto bg-white p-10 text-black print:p-6"
        style={{
          width: '210mm',
          minHeight: '297mm',
          fontFamily: 'Times New Roman, serif',
        }}
      >
        {/* HEADER */}
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase">
            Shree Lautan Ram Dropadi Devi Secondary School
          </h1>
          <p className="text-sm">Bijaynagar–7, Ganeshpur</p>
          <p className="mt-2 font-semibold underline">MARKSHEET</p>
          <p className="text-sm mt-1">{exam.name} | Academic Year: {exam.academic_years?.name}</p>
        </div>

        {/* STUDENT DETAILS */}
        <div className="grid grid-cols-2 text-sm mb-6 gap-y-2">
          <p><strong>Name:</strong> {student.full_name}</p>
          <p><strong>Class:</strong> {student.classes?.name}</p>
          <p><strong>Roll No:</strong> {student.roll_number}</p>
          <p><strong>Section:</strong> {student.sections?.name}</p>
          <p><strong>Father’s Name:</strong> {student.father_name}</p>
          <p><strong>Student ID:</strong> {student.student_id}</p>
        </div>

        {/* MARKS TABLE */}
        
        <table className="w-full border border-black text-sm mb-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">SN</th>
              <th className="border p-2 text-left">Subject</th>
              <th className="border p-2">Full</th>
              <th className="border p-2">Pass</th>
              <th className="border p-2">Obtained</th>
              <th className="border p-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((m, i) => (
              <tr key={m.id}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{m.subjects?.name}</td>
                <td className="border p-2 text-center">{m.subjects?.full_marks}</td>
                <td className="border p-2 text-center">{m.subjects?.pass_marks}</td>
                <td className="border p-2 text-center">{m.marks_obtained ?? '-'}</td>
                <td className="border p-2 text-center">{m.grade ?? '-'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="font-bold bg-gray-100">
            <tr>
              <td colSpan={2} className="border p-2 text-right">Total</td>
              <td className="border p-2 text-center">{totalFullMarks}</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-center">{totalMarks}</td>
              <td className="border p-2 text-center">{overallGrade}</td>
            </tr>
          </tfoot>
        </table>

        {/* RESULT SUMMARY */}
        <div className="grid grid-cols-3 text-center mb-10">
          <div>
            <p className="text-sm">Percentage</p>
            <p className="text-xl font-bold">{percentage}%</p>
          </div>
          <div>
            <p className="text-sm">Grade</p>
            <p className="text-xl font-bold">{overallGrade}</p>
          </div>
          <div>
            <p className="text-sm">Result</p>
            <p className={`text-xl font-bold ${result === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
              {result}
            </p>
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="flex justify-between mt-16 text-sm">
          <div className="text-center">
            <div className="border-t border-black w-40 mx-auto mb-1"></div>
            Class Teacher
          </div>
          <div className="text-center">
            <div className="border-t border-black w-40 mx-auto mb-1"></div>
            Exam Controller
          </div>
          <div className="text-center">
            <div className="border-t border-black w-40 mx-auto mb-1"></div>
            Principal
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs mt-6">
          Generated on {format(new Date(), 'PPP')} • Computer Generated Marksheet
        </p>
      </div>
    </>
  );
};

export default MarksheetTemplate;
