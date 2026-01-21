import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudents, useClassSubjects, useMarks, useSaveMarks, useExams, ClassSubject, Mark, Student } from '@/hooks/useStudentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, Save, Loader2, Upload, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MarkEntry {
  student_id: string;
  exam_id: string;
  subject_id: string;
  marks_obtained: number | null;
  remarks?: string;
}

const AdminMarksEntry = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [marksData, setMarksData] = useState<Record<string, Record<string, number | null>>>({});
  const [sections, setSections] = useState<Array<{ id: string; name: string }>>([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: exams = [] } = useExams();
  const exam = exams.find(e => e.id === examId);
  
  const { data: classSubjects = [] } = useClassSubjects(exam?.class_id);
  const { data: students = [], isLoading: studentsLoading } = useStudents(
    exam?.class_id,
    selectedSection || undefined
  );
  const { data: existingMarks = [] } = useMarks(examId);
  const saveMarks = useSaveMarks();

  // Load sections for the class
  useEffect(() => {
    const loadSections = async () => {
      if (!exam?.class_id) return;
      const { data } = await supabase
        .from('sections')
        .select('*')
        .eq('class_id', exam.class_id)
        .order('name');
      if (data) setSections(data);
    };
    loadSections();
  }, [exam?.class_id]);

  // Initialize marks data from existing marks
  useEffect(() => {
    const initialMarks: Record<string, Record<string, number | null>> = {};
    existingMarks.forEach((mark) => {
      if (!initialMarks[mark.student_id]) {
        initialMarks[mark.student_id] = {};
      }
      initialMarks[mark.student_id][mark.subject_id] = mark.marks_obtained;
    });
    setMarksData(initialMarks);
  }, [existingMarks]);

  const handleMarkChange = (studentId: string, subjectId: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    const subject = classSubjects.find(cs => cs.subject_id === subjectId)?.subjects;
    
    if (numValue !== null && subject) {
      if (numValue < 0 || numValue > subject.full_marks) {
        toast.error(`Marks must be between 0 and ${subject.full_marks}`);
        return;
      }
    }

    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectId]: numValue,
      },
    }));
  };

  const handleSaveMarks = async () => {
    if (!examId) return;

    const marksToSave: MarkEntry[] = [];
    
    Object.entries(marksData).forEach(([studentId, subjects]) => {
      Object.entries(subjects).forEach(([subjectId, marksObtained]) => {
        marksToSave.push({
          student_id: studentId,
          exam_id: examId,
          subject_id: subjectId,
          marks_obtained: marksObtained,
        });
      });
    });

    if (marksToSave.length === 0) {
      toast.error('No marks to save');
      return;
    }

    await saveMarks.mutateAsync(marksToSave);
  };

  // Download CSV Template
  const handleDownloadTemplate = () => {
    if (classSubjects.length === 0 || students.length === 0) {
      toast.error('No subjects or students available');
      return;
    }

    const headers = ['Roll Number', 'Student ID', 'Student Name', ...classSubjects.map(cs => cs.subjects.name)];
    const rows = students.map(student => {
      const studentMarks = marksData[student.id] || {};
      return [
        student.roll_number,
        student.student_id,
        student.full_name,
        ...classSubjects.map(cs => studentMarks[cs.subject_id] ?? '')
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `marks_template_${exam?.name?.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  // Import CSV
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      toast.error('CSV file is empty or invalid');
      return;
    }

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const errors: string[] = [];
    const newMarksData: Record<string, Record<string, number | null>> = { ...marksData };
    let importedCount = 0;

    // Find subject column indices
    const subjectIndices: Record<string, number> = {};
    classSubjects.forEach(cs => {
      const index = headers.findIndex(h => h.toLowerCase() === cs.subjects.name.toLowerCase());
      if (index !== -1) {
        subjectIndices[cs.subject_id] = index;
      }
    });

    // Find student ID column
    const studentIdIndex = headers.findIndex(h => h.toLowerCase().includes('student id'));
    const rollIndex = headers.findIndex(h => h.toLowerCase().includes('roll'));

    if (studentIdIndex === -1 && rollIndex === -1) {
      toast.error('CSV must have a "Student ID" or "Roll Number" column');
      return;
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
      
      // Find student by ID or roll number
      let student: Student | undefined;
      if (studentIdIndex !== -1) {
        student = students.find(s => s.student_id === values[studentIdIndex]);
      }
      if (!student && rollIndex !== -1) {
        student = students.find(s => s.roll_number.toString() === values[rollIndex]);
      }

      if (!student) {
        errors.push(`Row ${i + 1}: Student not found`);
        continue;
      }

      // Extract marks for each subject
      Object.entries(subjectIndices).forEach(([subjectId, colIndex]) => {
        const value = values[colIndex];
        if (value === '' || value === undefined) return;

        const marks = parseFloat(value);
        const subject = classSubjects.find(cs => cs.subject_id === subjectId)?.subjects;

        if (isNaN(marks)) {
          errors.push(`Row ${i + 1}: Invalid marks for ${subject?.name || 'subject'}`);
          return;
        }

        if (subject && (marks < 0 || marks > subject.full_marks)) {
          errors.push(`Row ${i + 1}: Marks for ${subject.name} must be 0-${subject.full_marks}`);
          return;
        }

        if (!newMarksData[student!.id]) {
          newMarksData[student!.id] = {};
        }
        newMarksData[student!.id][subjectId] = marks;
        importedCount++;
      });
    }

    setMarksData(newMarksData);
    setImportErrors(errors);

    if (errors.length > 0) {
      setIsImportOpen(true);
    }
    
    toast.success(`Imported marks for ${importedCount} entries`);
  };

  const getGrade = (marks: number | null, fullMarks: number): string => {
    if (marks === null) return '-';
    const percentage = (marks / fullMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 32) return 'D+';
    if (percentage >= 20) return 'D';
    return 'E';
  };

  const getGradeColor = (grade: string): string => {
    const colors: Record<string, string> = {
      'A+': 'text-green-600',
      'A': 'text-green-500',
      'B+': 'text-blue-600',
      'B': 'text-blue-500',
      'C+': 'text-yellow-600',
      'C': 'text-yellow-500',
      'D+': 'text-orange-600',
      'D': 'text-orange-500',
      'E': 'text-red-600',
    };
    return colors[grade] || '';
  };

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Exam not found</p>
        <Button variant="outline" onClick={() => navigate('/admin/exams')} className="mt-4">
          Back to Exams
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/exams')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{exam.name}</h1>
          <p className="text-muted-foreground">
            {exam.classes?.name} • {exam.academic_years?.name}
          </p>
        </div>
        <Button onClick={handleSaveMarks} disabled={saveMarks.isPending}>
          {saveMarks.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Marks
        </Button>
      </div>

      {/* Import/Export Actions */}
      {classSubjects.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
              id="csv-import"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import from CSV
            </Button>
          </div>
        </div>
      )}

      {/* Section Filter */}
      <div className="flex gap-4">
        <Select value={selectedSection || 'all'} onValueChange={(v) => setSelectedSection(v === 'all' ? '' : v)}>
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
        <Badge variant="outline" className="h-10 px-4 flex items-center">
          {students.length} Students
        </Badge>
      </div>

      {/* No subjects warning */}
      {classSubjects.length === 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">No Subjects Assigned</h3>
          <p className="text-muted-foreground mb-4">
            There are no subjects assigned to {exam.classes?.name}. Please add subjects first.
          </p>
          <Button variant="outline" onClick={() => navigate('/admin/subjects')}>
            Go to Subjects Management
          </Button>
        </div>
      )}

      {/* Marks Entry Table */}
      {classSubjects.length > 0 && (
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background">Roll</TableHead>
              <TableHead className="sticky left-12 bg-background min-w-[150px]">Student Name</TableHead>
              {classSubjects.map((cs) => (
                <TableHead key={cs.subject_id} className="text-center min-w-[100px]">
                  <div>{cs.subjects.name}</div>
                  <div className="text-xs font-normal text-muted-foreground">
                    FM: {cs.subjects.full_marks} | PM: {cs.subjects.pass_marks}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">%</TableHead>
              <TableHead className="text-center">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentsLoading ? (
              <TableRow>
                <TableCell colSpan={classSubjects.length + 5} className="text-center py-8">
                  Loading students...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={classSubjects.length + 5} className="text-center py-8 text-muted-foreground">
                  No students found in this class
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => {
                const studentMarks = marksData[student.id] || {};
                let totalMarks = 0;
                let totalFullMarks = 0;
                let hasAllMarks = true;

                classSubjects.forEach((cs) => {
                  const mark = studentMarks[cs.subject_id];
                  if (mark !== null && mark !== undefined) {
                    totalMarks += mark;
                  } else {
                    hasAllMarks = false;
                  }
                  totalFullMarks += cs.subjects.full_marks;
                });

                const percentage = hasAllMarks && totalFullMarks > 0 
                  ? ((totalMarks / totalFullMarks) * 100).toFixed(2) 
                  : '-';
                const gpa = hasAllMarks ? getGrade(totalMarks, totalFullMarks) : '-';

                return (
                  <TableRow key={student.id}>
                    <TableCell className="sticky left-0 bg-background font-medium">
                      {student.roll_number}
                    </TableCell>
                    <TableCell className="sticky left-12 bg-background">
                      {student.full_name}
                    </TableCell>
                    {classSubjects.map((cs) => {
                      const mark = studentMarks[cs.subject_id];
                      const grade = getGrade(mark, cs.subjects.full_marks);
                      return (
                        <TableCell key={cs.subject_id} className="text-center p-1">
                          <div className="flex flex-col items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              max={cs.subjects.full_marks}
                              value={mark ?? ''}
                              onChange={(e) => handleMarkChange(student.id, cs.subject_id, e.target.value)}
                              className="w-20 text-center h-8"
                              placeholder="-"
                            />
                            <span className={`text-xs font-medium ${getGradeColor(grade)}`}>
                              {grade}
                            </span>
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-medium">
                      {hasAllMarks ? totalMarks : '-'}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {percentage}%
                    </TableCell>
                    <TableCell className={`text-center font-bold ${getGradeColor(gpa)}`}>
                      {gpa}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      )}

      {/* Legend */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">Grade Scale</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-green-600">A+ (90-100%)</span>
          <span className="text-green-500">A (80-89%)</span>
          <span className="text-blue-600">B+ (70-79%)</span>
          <span className="text-blue-500">B (60-69%)</span>
          <span className="text-yellow-600">C+ (50-59%)</span>
          <span className="text-yellow-500">C (40-49%)</span>
          <span className="text-orange-600">D+ (32-39%)</span>
          <span className="text-orange-500">D (20-31%)</span>
          <span className="text-red-600">E (Below 20%)</span>
        </div>
      </div>

      {/* Import Errors Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Import Results
            </DialogTitle>
            <DialogDescription>
              Some rows had issues during import
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-60 overflow-y-auto">
            {importErrors.map((error, idx) => (
              <p key={idx} className="text-sm text-destructive py-1 border-b last:border-0">
                {error}
              </p>
            ))}
          </div>
          <Button onClick={() => setIsImportOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMarksEntry;
