import { Student } from '@/hooks/useStudentManagement';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, Phone, Mail, MapPin, Hash, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

interface StudentDetailsProps {
  student: Student;
}

const StudentDetails = ({ student }: StudentDetailsProps) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'secondary',
      graduated: 'outline',
      transferred: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{student.full_name}</h2>
            {getStatusBadge(student.status)}
          </div>
          <p className="text-muted-foreground font-mono">{student.student_id}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {student.classes?.name} • Section {student.sections?.name} • Roll No. {student.roll_number}
          </p>
        </div>
      </div>

      <Separator />

      {/* Personal Information */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">PERSONAL INFORMATION</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{format(new Date(student.date_of_birth), 'PPP')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Father's Name</p>
              <p className="font-medium">{student.father_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Mother's Name</p>
              <p className="font-medium">{student.mother_name}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">CONTACT INFORMATION</h3>
        <div className="grid grid-cols-1 gap-3">
          {student.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{student.phone}</p>
              </div>
            </div>
          )}
          {student.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
            </div>
          )}
          {student.address && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="font-medium">{student.address}</p>
              </div>
            </div>
          )}
          {!student.phone && !student.email && !student.address && (
            <p className="text-muted-foreground text-sm">No contact information provided</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Academic Information */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">ACADEMIC INFORMATION</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Class</p>
              <p className="font-medium">{student.classes?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Section</p>
              <p className="font-medium">{student.sections?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Roll Number</p>
              <p className="font-medium">{student.roll_number}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="text-xs text-muted-foreground pt-4 border-t">
        <p>Registered on: {format(new Date(student.created_at), 'PPP')}</p>
        <p>Last updated: {format(new Date(student.updated_at), 'PPP')}</p>
      </div>
    </div>
  );
};

export default StudentDetails;
