import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClasses, useSections, useBulkCreateStudents } from '@/hooks/useStudentManagement';
import { Upload, FileText, AlertCircle, CheckCircle, Download, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface ParsedStudent {
  full_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone?: string;
  email?: string;
  address?: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  isValid: boolean;
  errors: string[];
}

interface StudentBulkImportProps {
  onSuccess?: () => void;
}

const StudentBulkImport = ({ onSuccess }: StudentBulkImportProps) => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [parsedStudents, setParsedStudents] = useState<ParsedStudent[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: classes = [] } = useClasses();
  const { data: sections = [] } = useSections(selectedClass || undefined);
  const bulkCreate = useBulkCreateStudents();

  const downloadTemplate = () => {
    const headers = ['full_name', 'father_name', 'mother_name', 'date_of_birth', 'phone', 'email', 'address', 'status'];
    const sampleData = [
      ['Ram Sharma', 'Hari Sharma', 'Sita Sharma', '2015-05-15', '9841234567', 'ram@example.com', 'Kathmandu', 'active'],
      ['Sita Thapa', 'Gopal Thapa', 'Gita Thapa', '2015-08-20', '9851234567', '', 'Lalitpur', 'active'],
    ];
    
    const csvContent = [headers.join(','), ...sampleData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateStudent = (student: Partial<ParsedStudent>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!student.full_name || student.full_name.length < 2) {
      errors.push('Full name is required (min 2 chars)');
    }
    if (!student.father_name || student.father_name.length < 2) {
      errors.push('Father name is required');
    }
    if (!student.mother_name || student.mother_name.length < 2) {
      errors.push('Mother name is required');
    }
    if (!student.date_of_birth) {
      errors.push('Date of birth is required');
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(student.date_of_birth)) {
        errors.push('Invalid date format (use YYYY-MM-DD)');
      }
    }
    if (student.status && !['active', 'inactive', 'graduated', 'transferred'].includes(student.status)) {
      errors.push('Invalid status');
    }

    return { isValid: errors.length === 0, errors };
  };

  const parseCSV = (text: string): ParsedStudent[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      toast.error('CSV file must have a header row and at least one data row');
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    const students: ParsedStudent[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const studentData: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        studentData[header] = values[index] || '';
      });

      const student: ParsedStudent = {
        full_name: studentData.full_name || '',
        father_name: studentData.father_name || '',
        mother_name: studentData.mother_name || '',
        date_of_birth: studentData.date_of_birth || '',
        phone: studentData.phone || undefined,
        email: studentData.email || undefined,
        address: studentData.address || undefined,
        status: (studentData.status as ParsedStudent['status']) || 'active',
        isValid: false,
        errors: [],
      };

      const validation = validateStudent(student);
      student.isValid = validation.isValid;
      student.errors = validation.errors;
      students.push(student);
    }

    return students;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const students = parseCSV(text);
      setParsedStudents(students);
      
      if (students.length > 0) {
        const validCount = students.filter(s => s.isValid).length;
        toast.info(`Parsed ${students.length} students (${validCount} valid)`);
      }
    };
    reader.readAsText(file);
  };

  const removeStudent = (index: number) => {
    setParsedStudents(prev => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (!selectedClass || !selectedSection) {
      toast.error('Please select class and section');
      return;
    }

    const validStudents = parsedStudents.filter(s => s.isValid);
    if (validStudents.length === 0) {
      toast.error('No valid students to import');
      return;
    }

    const studentsToInsert = validStudents.map(s => ({
      full_name: s.full_name,
      father_name: s.father_name,
      mother_name: s.mother_name,
      date_of_birth: s.date_of_birth,
      class_id: selectedClass,
      section_id: selectedSection,
      phone: s.phone || null,
      email: s.email || null,
      address: s.address || null,
      status: s.status,
    }));

    await bulkCreate.mutateAsync(studentsToInsert);
    setParsedStudents([]);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onSuccess?.();
  };

  const validCount = parsedStudents.filter(s => s.isValid).length;
  const invalidCount = parsedStudents.length - validCount;

  return (
    <div className="space-y-6">
      {/* Class & Section Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Class *</label>
          <Select value={selectedClass} onValueChange={(value) => {
            setSelectedClass(value);
            setSelectedSection('');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Section *</label>
          <Select 
            value={selectedSection} 
            onValueChange={setSelectedSection}
            disabled={!selectedClass}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  Section {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template Download */}
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Download the CSV template to ensure correct format</span>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </AlertDescription>
      </Alert>

      {/* File Upload */}
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="cursor-pointer">
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            {fileName ? (
              <span className="text-foreground font-medium">{fileName}</span>
            ) : (
              <>Click to upload or drag and drop<br />CSV files only</>
            )}
          </p>
        </label>
      </div>

      {/* Preview Table */}
      {parsedStudents.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>{validCount} valid</span>
              </div>
              {invalidCount > 0 && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{invalidCount} invalid</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setParsedStudents([]);
                setFileName('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Clear All
            </Button>
          </div>

          <div className="border rounded-lg max-h-[300px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Father</TableHead>
                  <TableHead>Mother</TableHead>
                  <TableHead>DOB</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedStudents.map((student, index) => (
                  <TableRow key={index} className={!student.isValid ? 'bg-destructive/5' : ''}>
                    <TableCell>
                      {student.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div title={student.errors.join(', ')}>
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{student.full_name}</TableCell>
                    <TableCell>{student.father_name}</TableCell>
                    <TableCell>{student.mother_name}</TableCell>
                    <TableCell>{student.date_of_birth}</TableCell>
                    <TableCell>{student.phone || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeStudent(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {invalidCount > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {invalidCount} student(s) have validation errors and will be skipped.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button
              onClick={handleImport}
              disabled={validCount === 0 || !selectedClass || !selectedSection || bulkCreate.isPending}
            >
              {bulkCreate.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Import {validCount} Student{validCount !== 1 ? 's' : ''}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentBulkImport;