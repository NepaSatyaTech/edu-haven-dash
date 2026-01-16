import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudents, useClasses, useSections, Student } from '@/hooks/useStudentManagement';
import { StudentIDCard, StudentIDCardBack } from './StudentIDCard';
import { Printer, Download, CreditCard, Users, Loader2 } from 'lucide-react';

interface StudentIDCardGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedStudent?: Student;
}

export function StudentIDCardGenerator({ open, onOpenChange, preSelectedStudent }: StudentIDCardGeneratorProps) {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    preSelectedStudent ? [preSelectedStudent.id] : []
  );
  const [showBack, setShowBack] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: classes = [] } = useClasses();
  const { data: sections = [] } = useSections(selectedClass || undefined);
  const { data: students = [], isLoading } = useStudents(
    selectedClass || undefined,
    selectedSection || undefined
  );

  const selectedStudents = preSelectedStudent 
    ? [preSelectedStudent]
    : students.filter(s => selectedStudentIds.includes(s.id));

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
    
    // Wait for images to load
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Student ID Card Generator
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Left Panel - Selection */}
          {!preSelectedStudent && (
            <div className="w-72 flex flex-col gap-4 border-r pr-4">
              <div className="space-y-3">
                <div>
                  <Label>Class</Label>
                  <Select value={selectedClass} onValueChange={(v) => {
                    setSelectedClass(v);
                    setSelectedSection('');
                    setSelectedStudentIds([]);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Section</Label>
                  <Select 
                    value={selectedSection} 
                    onValueChange={setSelectedSection}
                    disabled={!selectedClass}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map(sec => (
                        <SelectItem key={sec.id} value={sec.id}>Section {sec.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedClass && (
                <div className="flex-1 min-h-0">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Students ({selectedStudentIds.length}/{students.length})
                    </Label>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs h-7">
                        All
                      </Button>
                      <Button variant="ghost" size="sm" onClick={deselectAll} className="text-xs h-7">
                        None
                      </Button>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px] border rounded-md p-2">
                      <div className="space-y-1">
                        {students.map(student => (
                          <label
                            key={student.id}
                            className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedStudentIds.includes(student.id)}
                              onCheckedChange={() => toggleStudent(student.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{student.full_name}</p>
                              <p className="text-xs text-muted-foreground">
                                Roll: {student.roll_number} • {student.student_id}
                              </p>
                            </div>
                          </label>
                        ))}
                        {students.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No students found
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t">
                <Checkbox
                  id="show-back"
                  checked={showBack}
                  onCheckedChange={(checked) => setShowBack(checked as boolean)}
                />
                <Label htmlFor="show-back" className="text-sm cursor-pointer">
                  Include card back
                </Label>
              </div>
            </div>
          )}

          {/* Right Panel - Preview */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                Preview ({selectedStudents.length} card{selectedStudents.length !== 1 ? 's' : ''})
              </h3>
              <Button
                onClick={handlePrint}
                disabled={selectedStudents.length === 0}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Cards
              </Button>
            </div>

            <ScrollArea className="flex-1 border rounded-lg p-4 bg-muted/30">
              {selectedStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                  <CreditCard className="h-12 w-12 mb-4 opacity-50" />
                  <p>Select students to generate ID cards</p>
                </div>
              ) : (
                <div ref={printRef} className="print-container flex flex-wrap gap-4 justify-center">
                  {selectedStudents.map(student => (
                    <div key={student.id} className="card-pair flex flex-col gap-2">
                      <StudentIDCard student={student} />
                      {showBack && <StudentIDCardBack student={student} />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
