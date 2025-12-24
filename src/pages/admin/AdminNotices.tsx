import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notice {
  id: string;
  title: string;
  content: string | null;
  category: string;
  is_published: boolean;
  created_at: string;
}

const AdminNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    is_published: true,
  });
  const { toast } = useToast();

  const categories = ['General', 'Exam', 'Holiday', 'Event', 'Sports', 'Academic'];

  const fetchNotices = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notices:', error);
      toast({ title: 'Error', description: 'Failed to load notices', variant: 'destructive' });
    } else {
      setNotices(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openModal = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        content: notice.content || '',
        category: notice.category,
        is_published: notice.is_published,
      });
    } else {
      setEditingNotice(null);
      setFormData({ title: '', content: '', category: 'General', is_published: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotice(null);
    setFormData({ title: '', content: '', category: 'General', is_published: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingNotice) {
      const { error } = await supabase
        .from('notices')
        .update(formData)
        .eq('id', editingNotice.id);

      if (error) {
        toast({ title: 'Error', description: 'Failed to update notice', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Notice updated successfully' });
        fetchNotices();
        closeModal();
      }
    } else {
      const { error } = await supabase.from('notices').insert([formData]);

      if (error) {
        toast({ title: 'Error', description: 'Failed to create notice', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Notice created successfully' });
        fetchNotices();
        closeModal();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    const { error } = await supabase.from('notices').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete notice', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Notice deleted successfully' });
      fetchNotices();
    }
  };

  const togglePublished = async (notice: Notice) => {
    const { error } = await supabase
      .from('notices')
      .update({ is_published: !notice.is_published })
      .eq('id', notice.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update notice', variant: 'destructive' });
    } else {
      fetchNotices();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Notices</h1>
          <p className="text-muted-foreground">Manage school announcements and notices</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Notice
        </Button>
      </div>

      {/* Notices List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notices.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No notices yet. Create your first notice!</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">Title</th>
                <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">Category</th>
                <th className="text-left p-4 font-semibold text-foreground hidden lg:table-cell">Date</th>
                <th className="text-center p-4 font-semibold text-foreground">Status</th>
                <th className="text-right p-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {notices.map((notice) => (
                <tr key={notice.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-foreground">{notice.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{notice.content}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {notice.category}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground">
                    {new Date(notice.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => togglePublished(notice)}
                      className={`p-2 rounded-lg transition-colors ${
                        notice.is_published
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {notice.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(notice)}
                        className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="p-2 rounded-lg bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-bold text-foreground">
                {editingNotice ? 'Edit Notice' : 'Add Notice'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Notice title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="Notice content..."
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-foreground">
                  Publish immediately
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingNotice ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotices;
