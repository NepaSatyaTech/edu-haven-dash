import { QRCodeSVG } from 'qrcode.react';
import { Student } from '@/hooks/useStudentManagement';
import { User } from 'lucide-react';

interface StudentIDCardProps {
  student: Student;
  schoolName?: string;
  schoolAddress?: string;
  schoolLogo?: string;
  validYear?: string;
}

export function StudentIDCard({ 
  student, 
  schoolName = "Edu Haven School",
  schoolAddress = "Kathmandu, Nepal",
  schoolLogo,
  validYear = "2024-2025"
}: StudentIDCardProps) {
  const qrData = JSON.stringify({
    id: student.student_id,
    name: student.full_name,
    class: student.classes?.name,
    section: student.sections?.name,
    roll: student.roll_number,
  });

  return (
    <div className="id-card w-[3.375in] h-[2.125in] bg-gradient-to-br from-primary/10 via-background to-primary/5 border-2 border-primary/30 rounded-lg overflow-hidden shadow-lg print:shadow-none relative">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-3 py-2 text-center">
        <h1 className="text-sm font-bold tracking-wide">{schoolName}</h1>
        <p className="text-[10px] opacity-90">{schoolAddress}</p>
      </div>

      {/* Body */}
      <div className="flex p-3 gap-3">
        {/* Photo Section */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-[1in] h-[1.2in] border-2 border-primary/30 rounded-md overflow-hidden bg-white flex items-center justify-center">
            {student.photo_url ? (
              <img
                src={student.photo_url}
                alt={student.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <p className="text-[8px] text-muted-foreground font-medium">
            Roll No: {student.roll_number}
          </p>
        </div>

        {/* Info Section */}
        <div className="flex-1 flex flex-col justify-between text-[10px]">
          <div className="space-y-1">
            <div>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Student Name</p>
              <p className="font-bold text-xs leading-tight">{student.full_name}</p>
            </div>
            <div>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Student ID</p>
              <p className="font-mono font-semibold">{student.student_id}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Class</p>
                <p className="font-semibold">{student.classes?.name}</p>
              </div>
              <div>
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Section</p>
                <p className="font-semibold">{student.sections?.name}</p>
              </div>
            </div>
            <div>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Guardian</p>
              <p className="font-medium truncate">{student.father_name}</p>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center">
          <QRCodeSVG
            value={qrData}
            size={60}
            level="M"
            includeMargin={false}
            className="rounded"
          />
          <p className="text-[7px] text-muted-foreground mt-1">Scan to verify</p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-primary/10 px-3 py-1 flex justify-between items-center border-t border-primary/20">
        <p className="text-[8px] text-muted-foreground">
          Valid: <span className="font-semibold">{validYear}</span>
        </p>
        <p className="text-[8px] text-muted-foreground">
          Status: <span className="font-semibold capitalize">{student.status}</span>
        </p>
      </div>
    </div>
  );
}

// Back of ID Card
export function StudentIDCardBack({ 
  student,
  schoolName = "Edu Haven School",
  schoolPhone = "+977-1-XXXXXXX",
  schoolEmail = "info@eduhaven.edu.np",
}: {
  student: Student;
  schoolName?: string;
  schoolPhone?: string;
  schoolEmail?: string;
}) {
  return (
    <div className="id-card-back w-[3.375in] h-[2.125in] bg-gradient-to-br from-primary/5 via-background to-primary/10 border-2 border-primary/30 rounded-lg overflow-hidden shadow-lg print:shadow-none">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-3 py-1.5 text-center">
        <h2 className="text-xs font-bold">STUDENT IDENTITY CARD</h2>
      </div>

      {/* Terms */}
      <div className="p-3 text-[8px] space-y-2">
        <div>
          <h3 className="font-bold text-[9px] mb-1">Terms & Conditions:</h3>
          <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
            <li>This card is the property of {schoolName}.</li>
            <li>If found, please return to the school office.</li>
            <li>This card is non-transferable.</li>
            <li>Report loss immediately to the administration.</li>
            <li>Card must be carried at all times on campus.</li>
          </ol>
        </div>

        <div className="border-t pt-2">
          <h3 className="font-bold text-[9px] mb-1">Emergency Contact:</h3>
          {student.phone && (
            <p className="text-muted-foreground">Student: {student.phone}</p>
          )}
          <p className="text-muted-foreground">School: {schoolPhone}</p>
        </div>

        <div className="flex justify-between items-end pt-1">
          <div>
            <p className="text-muted-foreground">Email: {schoolEmail}</p>
          </div>
          <div className="text-right">
            <div className="w-16 border-t border-foreground/50 mb-0.5"></div>
            <p className="text-[7px] text-muted-foreground">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
