import { useState } from 'react';
import { useStudents, useClasses, useSections, Student } from '@/hooks/useStudentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentIDCard, StudentIDCardBack } from '@/components/admin/StudentIDCard';
import { Search, CreditCard, Printer, Users, Loader2 } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useRef } from 'react';

const AdminIDCards = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [showBack, setShowBack] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: classes = [] } = useClasses();
  const { data: sections = [] } = useSections(selectedClass || undefined);
  const { data: students = [], isLoading } = useStudents(
    selectedClass || undefined,
    selectedSection || undefined,
    searchQuery || undefined
  );
  const { data: settings } = useSiteSettings();

  const schoolName = settings?.school_name?.value_en || 'School Name';
  const schoolAddress = settings?.address?.value_en || 'School Address';

  const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAll = () => {
    setSelectedStudentIds(students.map(s => s.id));
  };

  const deselectAll = () => {
    setSelectedStudentIds([]);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Convert images to base64 for printing
    const cards = printContent.querySelectorAll('.card-pair');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student ID Cards</title>
          <style>
            @page {
              size: letter;
              margin: 0.5in;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .print-container {
              display: flex;
              flex-wrap: wrap;
              gap: 0.25in;
              justify-content: center;
            }
            .card-pair {
              display: flex;
              flex-direction: column;
              gap: 0.125in;
              page-break-inside: avoid;
              margin-bottom: 0.25in;
            }
            .id-card, .id-card-back {
              width: 3.375in;
              height: 2.125in;
              border: 2px solid hsl(222.2 47.4% 80%);
              border-radius: 8px;
              overflow: hidden;
              background: linear-gradient(135deg, hsl(222.2 47.4% 95%) 0%, white 50%, hsl(222.2 47.4% 97%) 100%);
              position: relative;
              font-size: 10px;
            }
            .card-header {
              background: hsl(222.2 47.4% 11.2%);
              color: white;
              padding: 8px 12px;
              text-align: center;
            }
            .card-header h1, .card-header h2 {
              font-size: 11px;
              font-weight: bold;
              letter-spacing: 0.5px;
            }
            .card-header p {
              font-size: 8px;
              opacity: 0.9;
            }
            .card-body {
              display: flex;
              padding: 12px;
              gap: 12px;
            }
            .photo-section {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 4px;
            }
            .photo-box {
              width: 1in;
              height: 1.2in;
              border: 2px solid hsl(222.2 47.4% 80%);
              border-radius: 6px;
              overflow: hidden;
              background: white;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .photo-box img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .photo-placeholder {
              width: 40px;
              height: 40px;
              color: #999;
            }
            .roll-text {
              font-size: 8px;
              color: #666;
              font-weight: 500;
            }
            .info-section {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .info-row {
              margin-bottom: 4px;
            }
            .info-label {
              font-size: 7px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-value {
              font-weight: 600;
              font-size: 10px;
            }
            .info-value.name {
              font-size: 11px;
            }
            .info-value.mono {
              font-family: monospace;
            }
            .info-flex {
              display: flex;
              gap: 16px;
            }
            .qr-section {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .qr-section svg {
              width: 60px;
              height: 60px;
            }
            .qr-text {
              font-size: 7px;
              color: #666;
              margin-top: 4px;
            }
            .card-footer {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              background: hsl(222.2 47.4% 95%);
              padding: 4px 12px;
              display: flex;
              justify-content: space-between;
              border-top: 1px solid hsl(222.2 47.4% 80%);
              font-size: 8px;
              color: #666;
            }
            .card-footer span {
              font-weight: 600;
            }
            .back-content {
              padding: 12px;
              font-size: 8px;
            }
            .back-content h3 {
              font-size: 9px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .back-content ol {
              margin-left: 12px;
              color: #666;
            }
            .back-content li {
              margin-bottom: 2px;
            }
            .signature-line {
              width: 64px;
              border-top: 1px solid #333;
              margin-bottom: 2px;
            }
            @media print {
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for images to load before printing
    const images = printWindow.document.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    } else {
      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
          if (loadedCount === totalImages) {
            setTimeout(() => {
              printWindow.print();
              printWindow.close();
            }, 300);
          }
        } else {
          img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
              setTimeout(() => {
                printWindow.print();
                printWindow.close();
              }, 300);
            }
          };
          img.onerror = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
              setTimeout(() => {
                printWindow.print();
                printWindow.close();
              }, 300);
            }
          };
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Student ID Cards
          </h1>
          <p className="text-muted-foreground">Generate and print student ID cards</p>
        </div>
        <Button
          onClick={handlePrint}
          disabled={selectedStudents.length === 0}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Selected ({selectedStudents.length})
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedClass || 'all'} onValueChange={(v) => {
          setSelectedClass(v === 'all' ? '' : v);
          setSelectedSection('');
          setSelectedStudentIds([]);
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

        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or student ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="show-back"
            checked={showBack}
            onCheckedChange={(checked) => setShowBack(checked as boolean)}
          />
          <label htmlFor="show-back" className="text-sm cursor-pointer">
            Include card back
          </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Students Selection */}
        <div className="border rounded-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Select Students ({selectedStudentIds.length}/{students.length})
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="ghost" size="sm" onClick={deselectAll}>
                Clear
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Roll</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow 
                      key={student.id}
                      className={selectedStudentIds.includes(student.id) ? 'bg-primary/5' : ''}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedStudentIds.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.full_name}</p>
                          <p className="text-xs text-muted-foreground">{student.student_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{student.classes?.name}</TableCell>
                      <TableCell>{student.roll_number}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Preview */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <h3 className="font-semibold mb-4">Preview</h3>
          <ScrollArea className="h-[500px]">
            {selectedStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                <CreditCard className="h-12 w-12 mb-4 opacity-50" />
                <p>Select students to preview ID cards</p>
              </div>
            ) : (
              <div ref={printRef} className="print-container flex flex-wrap gap-4 justify-center">
                {selectedStudents.map(student => (
                  <div key={student.id} className="card-pair flex flex-col gap-2">
                    <StudentIDCard 
                      student={student} 
                      schoolName={schoolName}
                      schoolAddress={schoolAddress}
                    />
                    {showBack && <StudentIDCardBack student={student} schoolName={schoolName} />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AdminIDCards;
