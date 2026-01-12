import { useState, useRef } from 'react';
import { useStudents, useClasses, useSections, useExams, useAcademicYears, useStudentMarksheet, Student } from '@/hooks/useStudentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, FileText, Download, Printer } from 'lucide-react';
import MarksheetTemplate from '@/components/admin/MarksheetTemplate';

const AdminMarksheets = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isMarksheetOpen, setIsMarksheetOpen] = useState(false);
  const marksheetRef = useRef<HTMLDivElement>(null);

  const { data: classes = [] } = useClasses();
  const { data: sections = [] } = useSections(selectedClass || undefined);
  const { data: academicYears = [] } = useAcademicYears();
  const currentYear = academicYears.find(y => y.is_current);
  const { data: exams = [] } = useExams(selectedClass || undefined, currentYear?.id);
  const { data: students = [], isLoading } = useStudents(
    selectedClass || undefined,
    selectedSection || undefined,
    searchQuery || undefined
  );

  const publishedExams = exams.filter(e => e.is_published);

  const handleViewMarksheet = (student: Student) => {
    if (!selectedExam) {
      return;
    }
    setSelectedStudent(student);
    setIsMarksheetOpen(true);
  };

  const handlePrint = () => {
    if (marksheetRef.current) {
      const printContent = marksheetRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Marksheet - ${selectedStudent?.full_name}</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .no-print { display: none !important; }
              }
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #333; padding: 8px; text-align: center; }
              th { background-color: #f0f0f0; }
              .header { text-align: center; margin-bottom: 20px; }
              .logo { font-size: 24px; font-weight: bold; }
              .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
              .result { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: center; }
              .signature-section { display: flex; justify-content: space-between; margin-top: 60px; }
              .signature { text-align: center; }
              .signature-line { border-top: 1px solid #333; width: 150px; margin: 40px auto 10px; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Marksheet Generation
          </h1>
          <p className="text-muted-foreground">Generate and download student marksheets</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedClass || 'all'} onValueChange={(v) => {
          setSelectedClass(v === 'all' ? '' : v);
          setSelectedSection('');
          setSelectedExam('');
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedSection || 'all'} 
          onValueChange={(v) => setSelectedSection(v === 'all' ? '' : v)}
          disabled={!selectedClass}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {sections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                Section {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedExam || 'none'} 
          onValueChange={(v) => setSelectedExam(v === 'none' ? '' : v)}
          disabled={!selectedClass}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select Exam" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select Exam</SelectItem>
            {publishedExams.map((exam) => (
              <SelectItem key={exam.id} value={exam.id}>
                {exam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or student ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {!selectedExam && selectedClass && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-700">
          Please select an exam to generate marksheets. Only published exams are available.
        </div>
      )}

      {/* Students Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Roll No.</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading students...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-sm">{student.student_id}</TableCell>
                  <TableCell className="font-medium">{student.full_name}</TableCell>
                  <TableCell>{student.classes?.name}</TableCell>
                  <TableCell>{student.sections?.name}</TableCell>
                  <TableCell>{student.roll_number}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMarksheet(student)}
                      disabled={!selectedExam}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Marksheet
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Marksheet Dialog */}
      <Dialog open={isMarksheetOpen} onOpenChange={setIsMarksheetOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Student Marksheet</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div ref={marksheetRef}>
            {selectedStudent && selectedExam && (
              <MarksheetTemplate studentId={selectedStudent.id} examId={selectedExam} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMarksheets;
