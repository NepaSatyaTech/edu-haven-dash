import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, subMonths, addMonths, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { FileSpreadsheet, FileText, BarChart3, Calendar, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useClasses, useSections } from '@/hooks/useStudentManagement';

interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  students?: { full_name: string; roll_number: number; student_id: string };
}

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6'];

const AdminAttendanceReports = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');

  const { data: classes = [] } = useClasses();
  const { data: sections = [] } = useSections(selectedClass || undefined);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const weekStart = startOfWeek(currentMonth, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentMonth, { weekStartsOn: 0 });

  const dateRange = viewMode === 'monthly' 
    ? { start: format(monthStart, 'yyyy-MM-dd'), end: format(monthEnd, 'yyyy-MM-dd') }
    : { start: format(weekStart, 'yyyy-MM-dd'), end: format(weekEnd, 'yyyy-MM-dd') };

  const { data: attendanceData = [], isLoading } = useQuery({
    queryKey: ['attendance-report', selectedClass, selectedSection, dateRange.start, dateRange.end],
    queryFn: async () => {
      if (!selectedClass || !selectedSection) return [];
      
      const { data, error } = await supabase
        .from('attendance')
        .select('*, students(full_name, roll_number, student_id)')
        .eq('class_id', selectedClass)
        .eq('section_id', selectedSection)
        .gte('date', dateRange.start)
        .lte('date', dateRange.end);
      
      if (error) throw error;
      return data as AttendanceRecord[];
    },
    enabled: !!selectedClass && !!selectedSection,
  });

  // Summary statistics
  const summary = useMemo(() => {
    const total = attendanceData.length;
    const present = attendanceData.filter(a => a.status === 'present').length;
    const absent = attendanceData.filter(a => a.status === 'absent').length;
    const late = attendanceData.filter(a => a.status === 'late').length;
    const leave = attendanceData.filter(a => a.status === 'leave').length;
    
    return { total, present, absent, late, leave };
  }, [attendanceData]);

  // Data for pie chart
  const pieData = [
    { name: 'Present', value: summary.present, color: COLORS[0] },
    { name: 'Absent', value: summary.absent, color: COLORS[1] },
    { name: 'Late', value: summary.late, color: COLORS[2] },
    { name: 'Leave', value: summary.leave, color: COLORS[3] },
  ].filter(d => d.value > 0);

  // Data for bar chart (daily breakdown)
  const barData = useMemo(() => {
    const days = viewMode === 'monthly'
      ? eachDayOfInterval({ start: monthStart, end: monthEnd })
      : eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayRecords = attendanceData.filter(a => a.date === dateStr);
      
      return {
        date: format(day, viewMode === 'monthly' ? 'dd' : 'EEE'),
        fullDate: format(day, 'MMM dd'),
        Present: dayRecords.filter(r => r.status === 'present').length,
        Absent: dayRecords.filter(r => r.status === 'absent').length,
        Late: dayRecords.filter(r => r.status === 'late').length,
        Leave: dayRecords.filter(r => r.status === 'leave').length,
      };
    });
  }, [attendanceData, viewMode, monthStart, monthEnd, weekStart, weekEnd]);

  // Student-wise summary
  const studentSummary = useMemo(() => {
    const studentMap = new Map<string, { 
      name: string; 
      rollNo: number; 
      studentId: string;
      present: number; 
      absent: number; 
      late: number; 
      leave: number; 
      total: number;
    }>();

    attendanceData.forEach(record => {
      const existing = studentMap.get(record.student_id) || {
        name: record.students?.full_name || 'Unknown',
        rollNo: record.students?.roll_number || 0,
        studentId: record.students?.student_id || '',
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        total: 0,
      };

      existing[record.status]++;
      existing.total++;
      studentMap.set(record.student_id, existing);
    });

    return Array.from(studentMap.values()).sort((a, b) => a.rollNo - b.rollNo);
  }, [attendanceData]);

  // Export to Excel (CSV)
  const exportToExcel = () => {
    const className = classes.find(c => c.id === selectedClass)?.name || '';
    const sectionName = sections.find(s => s.id === selectedSection)?.name || '';
    
    const headers = ['Roll No', 'Student ID', 'Name', 'Present', 'Absent', 'Late', 'Leave', 'Total Days', 'Attendance %'];
    const rows = studentSummary.map(s => [
      s.rollNo,
      s.studentId,
      s.name,
      s.present,
      s.absent,
      s.late,
      s.leave,
      s.total,
      s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) + '%' : '0%'
    ]);

    const csvContent = [
      [`Attendance Report - ${className} ${sectionName}`],
      [`Period: ${format(parseISO(dateRange.start), 'MMM dd, yyyy')} to ${format(parseISO(dateRange.end), 'MMM dd, yyyy')}`],
      [],
      headers,
      ...rows
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_report_${className}_${sectionName}_${format(currentMonth, 'yyyy-MM')}.csv`;
    link.click();
  };

  // Export to PDF (print)
  const exportToPDF = () => {
    const className = classes.find(c => c.id === selectedClass)?.name || '';
    const sectionName = sections.find(s => s.id === selectedSection)?.name || '';
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Attendance Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: center; }
          th { background: #f0f0f0; }
          .header-info { margin-bottom: 20px; }
          .summary { display: flex; gap: 20px; margin: 20px 0; }
          .summary-card { padding: 10px 20px; border: 1px solid #ddd; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>Attendance Report</h1>
        <div class="header-info">
          <p><strong>Class:</strong> ${className} - Section ${sectionName}</p>
          <p><strong>Period:</strong> ${format(parseISO(dateRange.start), 'MMM dd, yyyy')} to ${format(parseISO(dateRange.end), 'MMM dd, yyyy')}</p>
        </div>
        <div class="summary">
          <div class="summary-card"><strong>Present:</strong> ${summary.present}</div>
          <div class="summary-card"><strong>Absent:</strong> ${summary.absent}</div>
          <div class="summary-card"><strong>Late:</strong> ${summary.late}</div>
          <div class="summary-card"><strong>Leave:</strong> ${summary.leave}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Leave</th>
              <th>Total</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            ${studentSummary.map(s => `
              <tr>
                <td>${s.rollNo}</td>
                <td>${s.studentId}</td>
                <td>${s.name}</td>
                <td style="color: green;">${s.present}</td>
                <td style="color: red;">${s.absent}</td>
                <td style="color: orange;">${s.late}</td>
                <td style="color: blue;">${s.leave}</td>
                <td>${s.total}</td>
                <td>${s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) : 0}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
          Generated on ${format(new Date(), 'PPP p')}
        </p>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const chartConfig = {
    Present: { label: 'Present', color: COLORS[0] },
    Absent: { label: 'Absent', color: COLORS[1] },
    Late: { label: 'Late', color: COLORS[2] },
    Leave: { label: 'Leave', color: COLORS[3] },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Attendance Reports
          </h1>
          <p className="text-muted-foreground">View attendance statistics and export reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel} disabled={studentSummary.length === 0}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={exportToPDF} disabled={studentSummary.length === 0}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Class</label>
            <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setSelectedSection(''); }}>
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
            <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedClass}>
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
          <div>
            <label className="block text-sm font-medium mb-2">View Mode</label>
            <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'monthly' | 'weekly')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Period</label>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center font-medium py-2 px-4 border rounded-lg bg-background">
                <Calendar className="h-4 w-4 inline-block mr-2" />
                {format(currentMonth, viewMode === 'monthly' ? 'MMMM yyyy' : "'Week of' MMM dd, yyyy")}
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {!selectedClass || !selectedSection ? (
        <div className="glass-card p-12 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select class and section to view attendance reports</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : attendanceData.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No attendance data found for this period</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-3xl font-bold text-emerald-500">{summary.present}</p>
              <p className="text-xs text-muted-foreground">
                {summary.total > 0 ? ((summary.present / summary.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-3xl font-bold text-destructive">{summary.absent}</p>
              <p className="text-xs text-muted-foreground">
                {summary.total > 0 ? ((summary.absent / summary.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Late</p>
              <p className="text-3xl font-bold text-amber-500">{summary.late}</p>
              <p className="text-xs text-muted-foreground">
                {summary.total > 0 ? ((summary.late / summary.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Leave</p>
              <p className="text-3xl font-bold text-blue-500">{summary.leave}</p>
              <p className="text-xs text-muted-foreground">
                {summary.total > 0 ? ((summary.leave / summary.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Bar Chart */}
            <div className="glass-card p-6 md:col-span-2">
              <h3 className="font-semibold mb-4">Daily Attendance Overview</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="Present" stackId="a" fill={COLORS[0]} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Absent" stackId="a" fill={COLORS[1]} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Late" stackId="a" fill={COLORS[2]} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Leave" stackId="a" fill={COLORS[3]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Pie Chart */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Overall Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student-wise Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Student-wise Attendance Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Roll</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Student ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-emerald-600">Present</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-destructive">Absent</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-amber-600">Late</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-blue-600">Leave</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">Total</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {studentSummary.map((student) => {
                    const percentage = student.total > 0 ? (student.present / student.total) * 100 : 0;
                    return (
                      <tr key={student.studentId} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm font-medium">{student.rollNo}</td>
                        <td className="px-4 py-3 text-sm font-mono">{student.studentId}</td>
                        <td className="px-4 py-3 text-sm">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-center text-emerald-600 font-medium">{student.present}</td>
                        <td className="px-4 py-3 text-sm text-center text-destructive font-medium">{student.absent}</td>
                        <td className="px-4 py-3 text-sm text-center text-amber-600 font-medium">{student.late}</td>
                        <td className="px-4 py-3 text-sm text-center text-blue-600 font-medium">{student.leave}</td>
                        <td className="px-4 py-3 text-sm text-center">{student.total}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`font-medium ${percentage >= 75 ? 'text-emerald-600' : percentage >= 50 ? 'text-amber-600' : 'text-destructive'}`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAttendanceReports;
