import { useState, useEffect } from 'react';
import { Eye, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Admission {
  id: string;
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  grade: string;
  message: string | null;
  status: string;
  is_read: boolean;
  created_at: string;
}

const AdminAdmissions = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  const fetchAdmissions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('admission_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admissions:', error);
      toast({ title: 'Error', description: 'Failed to load admissions', variant: 'destructive' });
    } else {
      setAdmissions(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('admission_inquiries')
      .update({ status, is_read: true })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Status updated successfully' });
      fetchAdmissions();
      if (selectedAdmission?.id === id) {
        setSelectedAdmission({ ...selectedAdmission, status, is_read: true });
      }
    }
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('admission_inquiries')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      fetchAdmissions();
    }
  };

  const openAdmission = (admission: Admission) => {
    setSelectedAdmission(admission);
    if (!admission.is_read) {
      markAsRead(admission.id);
    }
  };

  const filteredAdmissions = filter === 'all'
    ? admissions
    : admissions.filter(a => a.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-600';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-amber-500/10 text-amber-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const pendingCount = admissions.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Admissions</h1>
          <p className="text-muted-foreground">
            Manage admission inquiries {pendingCount > 0 && `(${pendingCount} pending)`}
          </p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Admissions List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredAdmissions.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No admission inquiries found.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {filteredAdmissions.map((admission) => (
                <div
                  key={admission.id}
                  onClick={() => openAdmission(admission)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedAdmission?.id === admission.id
                      ? 'bg-primary/10'
                      : admission.is_read
                      ? 'hover:bg-muted/50'
                      : 'bg-secondary/5 hover:bg-secondary/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {!admission.is_read && (
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                      )}
                      <p className={`font-medium ${!admission.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {admission.student_name}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(admission.status)}`}>
                      {getStatusIcon(admission.status)}
                      {admission.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Grade: {admission.grade}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(admission.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Detail */}
          {selectedAdmission ? (
            <div className="glass-card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Admission Inquiry
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedAdmission.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAdmission.status)}`}>
                  {getStatusIcon(selectedAdmission.status)}
                  {selectedAdmission.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Student Name</p>
                    <p className="font-medium text-foreground">{selectedAdmission.student_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Parent Name</p>
                    <p className="font-medium text-foreground">{selectedAdmission.parent_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                    <p className="font-medium text-foreground">{selectedAdmission.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                    <p className="font-medium text-foreground">{selectedAdmission.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Grade Applying For</p>
                    <p className="font-medium text-foreground">{selectedAdmission.grade}</p>
                  </div>
                </div>

                {selectedAdmission.message && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Message</p>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-foreground">{selectedAdmission.message}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedAdmission.status === 'pending' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => updateStatus(selectedAdmission.id, 'approved')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateStatus(selectedAdmission.id, 'rejected')}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              <div className="mt-4">
                <a
                  href={`mailto:${selectedAdmission.email}?subject=Admission Inquiry - ${selectedAdmission.student_name}`}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Send Email →
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 flex items-center justify-center">
              <div className="text-center">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select an inquiry to view details</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAdmissions;
