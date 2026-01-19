import { useState, useEffect } from 'react';
import { Check, X, Clock, AlertCircle, Calendar, Users, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  roll_number: number;
  photo_url: string | null;
}

interface AttendanceRecord {
  student_id: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  remarks: string;
}

interface Class {
  id: string;
  name: string;
  grade_level: number;
}

interface Section {
  id: string;
  name: string;
  class_id: string;
}

const AdminAttendance = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [existingAttendance, setExistingAttendance] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase
        .from('classes')
        .select('*')
        .order('grade_level');
      setClasses(data || []);
    };
    fetchClasses();
  }, []);

  // Fetch sections when class changes
  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      setSelectedSection('');
      return;
    }
    const fetchSections = async () => {
      const { data } = await supabase
        .from('sections')
        .select('*')
        .eq('class_id', selectedClass)
        .order('name');
      setSections(data || []);
      setSelectedSection('');
    };
    fetchSections();
  }, [selectedClass]);

  // Fetch students and existing attendance when section or date changes
  useEffect(() => {
    if (!selectedClass || !selectedSection) {
      setStudents([]);
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch students
      const { data: studentsData } = await supabase
        .from('students')
        .select('id, student_id, full_name, roll_number, photo_url')
        .eq('class_id', selectedClass)
        .eq('section_id', selectedSection)
        .eq('status', 'active')
        .order('roll_number');
      
      setStudents(studentsData || []);
      
      // Fetch existing attendance for the date
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('student_id, status, remarks')
        .eq('class_id', selectedClass)
        .eq('section_id', selectedSection)
        .eq('date', selectedDate);
      
      const existingMap: Record<string, string> = {};
      const attendanceMap: Record<string, AttendanceRecord> = {};
      
      (attendanceData || []).forEach((record) => {
        existingMap[record.student_id] = record.status;
        attendanceMap[record.student_id] = {
          student_id: record.student_id,
          status: record.status as AttendanceRecord['status'],
          remarks: record.remarks || '',
        };
      });
      
      // Initialize attendance for students without records
      (studentsData || []).forEach((student) => {
        if (!attendanceMap[student.id]) {
          attendanceMap[student.id] = {
            student_id: student.id,
            status: 'present',
            remarks: '',
          };
        }
      });
      
      setExistingAttendance(existingMap);
      setAttendance(attendanceMap);
      setIsLoading(false);
    };
    
    fetchData();
  }, [selectedClass, selectedSection, selectedDate]);

  const updateAttendance = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        student_id: studentId,
        status,
      },
    }));
  };

  const saveAttendance = async () => {
    if (!selectedClass || !selectedSection || students.length === 0) return;
    
    setIsSaving(true);
    
    try {
      const records = Object.values(attendance).map((record) => ({
        student_id: record.student_id,
        class_id: selectedClass,
        section_id: selectedSection,
        date: selectedDate,
        status: record.status,
        remarks: record.remarks || null,
      }));
      
      // Upsert attendance records
      const { error } = await supabase
        .from('attendance')
        .upsert(records, { onConflict: 'student_id,date' });
      
      if (error) throw error;
      
      // Update existing attendance map
      const existingMap: Record<string, string> = {};
      records.forEach((record) => {
        existingMap[record.student_id] = record.status;
      });
      setExistingAttendance(existingMap);
      
      toast({
        title: 'Success',
        description: 'Attendance saved successfully',
      });
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: 'Error',
        description: 'Failed to save attendance',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const markAllPresent = () => {
    const newAttendance: Record<string, AttendanceRecord> = {};
    students.forEach((student) => {
      newAttendance[student.id] = {
        student_id: student.id,
        status: 'present',
        remarks: '',
      };
    });
    setAttendance(newAttendance);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500 text-white';
      case 'absent':
        return 'bg-destructive text-destructive-foreground';
      case 'late':
        return 'bg-amber-500 text-white';
      case 'leave':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const presentCount = Object.values(attendance).filter((a) => a.status === 'present').length;
  const absentCount = Object.values(attendance).filter((a) => a.status === 'absent').length;
  const lateCount = Object.values(attendance).filter((a) => a.status === 'late').length;
  const leaveCount = Object.values(attendance).filter((a) => a.status === 'leave').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">Take and manage student attendance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
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
          <div>
            <label className="block text-sm font-medium mb-2">Section</label>
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
          <div className="flex items-end gap-2">
            <Button onClick={markAllPresent} variant="outline" disabled={students.length === 0}>
              Mark All Present
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {students.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-500">{presentCount}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <X className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{absentCount}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-500">{lateCount}</p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">{leaveCount}</p>
              <p className="text-sm text-muted-foreground">Leave</p>
            </div>
          </div>
        </div>
      )}

      {/* Attendance List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !selectedClass || !selectedSection ? (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select class and section to take attendance</p>
        </div>
      ) : students.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No students found in this class and section</p>
        </div>
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Roll</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium">{student.roll_number}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {student.photo_url ? (
                            <img
                              src={student.photo_url}
                              alt={student.full_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {student.full_name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span className="font-medium">{student.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{student.student_id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {(['present', 'absent', 'late', 'leave'] as const).map((status) => (
                            <button
                              key={status}
                              onClick={() => updateAttendance(student.id, status)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                attendance[student.id]?.status === status
                                  ? getStatusColor(status)
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveAttendance} disabled={isSaving} size="lg" className="gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAttendance;
