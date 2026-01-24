import { useState, useRef } from 'react';
import { useStudents, useClasses, useSections, useAcademicYears, Student } from '@/hooks/useStudentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, FileText, Printer, BookOpen } from 'lucide-react';
import CombinedMarksheetTemplate from '@/components/admin/CombinedMarksheetTemplate';

const AdminCombinedMarksheets = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isMarksheetOpen, setIsMarksheetOpen] = useState(false);
  const marksheetRef = useRef<HTMLDivElement>(null);

  const { data: classes = [] } = useClasses();
  const { data: sections = [] } = useSections(selectedClass || undefined);
  const { data: academicYears = [] } = useAcademicYears();
  const { data: students = [], isLoading } = useStudents(
    selectedClass || undefined,
    selectedSection || undefined,
    searchQuery || undefined
  );

  // Auto-select current academic year
  const currentYear = academicYears.find(y => y.is_current);
  
  const handleViewMarksheet = (student: Student) => {
    if (!selectedYear) {
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
            <title>Combined Marksheet - ${selectedStudent?.full_name}</title>
            <style>
              @media print {
                body { margin: 0; padding: 15px; font-family: 'Times New Roman', serif; }
                .no-print { display: none !important; }
                @page { size: A4 landscape; margin: 10mm; }
              }
              body { font-family: 'Times New Roman', serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #333; padding: 4px 6px; text-align: center; font-size: 11px; }
              th { background-color: #f0f0f0; }
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
            <BookOpen className="h-6 w-6" />
            Combined Marksheet
          </h1>
          <p className="text-muted-foreground">
            View consolidated results from all three exams (Periodic, Half-Yearly, Yearly)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedClass || 'all'} onValueChange={(v) => {
          setSelectedClass(v === 'all' ? '' : v);
          setSelectedSection('');
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
          value={selectedYear || (currentYear?.id || 'none')} 
          onValueChange={(v) => setSelectedYear(v === 'none' ? '' : v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Academic Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select Year</SelectItem>
            {academicYears.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                {year.name} {year.is_current && '(Current)'}
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

      {!selectedYear && selectedClass && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-700">
          Please select an academic year to generate combined marksheets.
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-700">
        <p className="font-medium">Combined Marksheet Features:</p>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li>Shows marks from all three terminal exams on a single sheet</li>
          <li>Displays Periodic Assessment, Half-Yearly, and Yearly End Exam results</li>
          <li>Calculates total marks and overall percentage across all exams</li>
          <li>Optimized for A4 landscape printing</li>
        </ul>
      </div>

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
                      disabled={!selectedYear && !currentYear?.id}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Combined
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Combined Marksheet Dialog */}
      <Dialog open={isMarksheetOpen} onOpenChange={setIsMarksheetOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Combined Progress Report</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print (Landscape)
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div ref={marksheetRef}>
            {selectedStudent && (selectedYear || currentYear?.id) && (
              <CombinedMarksheetTemplate 
                studentId={selectedStudent.id} 
                academicYearId={selectedYear || currentYear?.id || ''} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCombinedMarksheets;
