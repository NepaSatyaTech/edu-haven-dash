import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  name: string;
  role_en: string;
  role_ne: string | null;
  content_en: string;
  content_ne: string | null;
  rating: number;
  initials: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role_en: '',
    role_ne: '',
    content_en: '',
    content_ne: '',
    rating: 5,
    initials: '',
    is_published: true,
    display_order: 0,
  });
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching testimonials:', error);
      toast({ title: 'Error', description: 'Failed to load testimonials', variant: 'destructive' });
    } else {
      setTestimonials(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role_en: testimonial.role_en,
        role_ne: testimonial.role_ne || '',
        content_en: testimonial.content_en,
        content_ne: testimonial.content_ne || '',
        rating: testimonial.rating,
        initials: testimonial.initials || '',
        is_published: testimonial.is_published,
        display_order: testimonial.display_order,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        role_en: '',
        role_ne: '',
        content_en: '',
        content_ne: '',
        rating: 5,
        initials: '',
        is_published: true,
        display_order: testimonials.length,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      role_ne: formData.role_ne || null,
      content_ne: formData.content_ne || null,
      initials: formData.initials || formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    };

    if (editingTestimonial) {
      const { error } = await supabase
        .from('testimonials')
        .update(payload)
        .eq('id', editingTestimonial.id);

      if (error) {
        toast({ title: 'Error', description: 'Failed to update testimonial', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Testimonial updated successfully' });
        fetchTestimonials();
        closeModal();
      }
    } else {
      const { error } = await supabase.from('testimonials').insert([payload]);

      if (error) {
        toast({ title: 'Error', description: 'Failed to create testimonial', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Testimonial created successfully' });
        fetchTestimonials();
        closeModal();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    const { error } = await supabase.from('testimonials').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete testimonial', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Testimonial deleted successfully' });
      fetchTestimonials();
    }
  };

  const togglePublished = async (testimonial: Testimonial) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_published: !testimonial.is_published })
      .eq('id', testimonial.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update testimonial', variant: 'destructive' });
    } else {
      fetchTestimonials();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground">Manage parent and student testimonials</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Testimonials List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No testimonials yet. Create your first testimonial!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.initials || testimonial.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{testimonial.name}</h3>
                    <p className="text-xs text-muted-foreground">{testimonial.role_en}</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePublished(testimonial)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    testimonial.is_published
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {testimonial.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex gap-0.5 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                "{testimonial.content_en}"
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(testimonial)}
                  className="flex-1 py-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="py-2 px-3 rounded-lg bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-bold text-foreground">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Initials</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.initials}
                    onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g., SK"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.role_en}
                    onChange={(e) => setFormData({ ...formData, role_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g., Parent of Grade 8 Student"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role (Nepali)</label>
                  <input
                    type="text"
                    value={formData.role_ne}
                    onChange={(e) => setFormData({ ...formData, role_ne: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="नेपालीमा भूमिका"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Testimonial (English) *</label>
                <textarea
                  required
                  value={formData.content_en}
                  onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="Their testimonial in English..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Testimonial (Nepali)</label>
                <textarea
                  value={formData.content_ne}
                  onChange={(e) => setFormData({ ...formData, content_ne: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="नेपालीमा प्रशंसापत्र..."
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
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
                  {editingTestimonial ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;