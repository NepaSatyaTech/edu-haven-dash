import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Faculty {
  id: string;
  name: string;
  designation: string;
  qualification: string | null;
  passed_out_college: string | null;
  email: string | null;
  phone: string | null;
  department: string | null;
  image_url: string | null;
  bio: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    qualification: '',
    passed_out_college: '',
    email: '',
    phone: '',
    department: '',
    bio: '',
    is_active: true,
    display_order: 0,
  });
  const { toast } = useToast();

  const departments = ['Science', 'Mathematics', 'Languages', 'Social Studies', 'Computer Science', 'Arts', 'Music', 'Physical Education', 'Administration'];

  const fetchFaculty = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching faculty:', error);
      toast({ title: 'Error', description: 'Failed to load faculty', variant: 'destructive' });
    } else {
      setFaculty(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const openModal = (member?: Faculty) => {
    if (member) {
      setEditingFaculty(member);
      setFormData({
        name: member.name,
        designation: member.designation,
        qualification: member.qualification || '',
        passed_out_college: member.passed_out_college || '',
        email: member.email || '',
        phone: member.phone || '',
        department: member.department || '',
        bio: member.bio || '',
        is_active: member.is_active,
        display_order: member.display_order,
      });
      setPreviewUrl(member.image_url);
    } else {
      setEditingFaculty(null);
      setFormData({
        name: '',
        designation: '',
        qualification: '',
        passed_out_college: '',
        email: '',
        phone: '',
        department: '',
        bio: '',
        is_active: true,
        display_order: faculty.length,
      });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaculty(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({
      name: '',
      designation: '',
      qualification: '',
      passed_out_college: '',
      email: '',
      phone: '',
      department: '',
      bio: '',
      is_active: true,
      display_order: 0,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('faculty')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('faculty')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = editingFaculty?.image_url || null;

      // Upload new image if selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
          setIsUploading(false);
          return;
        }
      }

      const facultyData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingFaculty) {
        const { error } = await supabase
          .from('faculty')
          .update(facultyData)
          .eq('id', editingFaculty.id);

        if (error) {
          toast({ title: 'Error', description: 'Failed to update faculty', variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Faculty updated successfully' });
          fetchFaculty();
          closeModal();
        }
      } else {
        const { error } = await supabase.from('faculty').insert([facultyData]);

        if (error) {
          toast({ title: 'Error', description: 'Failed to add faculty', variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Faculty added successfully' });
          fetchFaculty();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving faculty:', error);
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (member: Faculty) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;

    try {
      // Delete image from storage if exists
      if (member.image_url) {
        const url = new URL(member.image_url);
        const pathParts = url.pathname.split('/');
        const filePath = pathParts.slice(pathParts.indexOf('faculty') + 1).join('/');
        await supabase.storage.from('faculty').remove([filePath]);
      }

      const { error } = await supabase.from('faculty').delete().eq('id', member.id);

      if (error) {
        toast({ title: 'Error', description: 'Failed to delete faculty', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Faculty deleted successfully' });
        fetchFaculty();
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    }
  };

  const toggleActive = async (member: Faculty) => {
    const { error } = await supabase
      .from('faculty')
      .update({ is_active: !member.is_active })
      .eq('id', member.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update faculty', variant: 'destructive' });
    } else {
      fetchFaculty();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Faculty</h1>
          <p className="text-muted-foreground">Manage teachers and staff members</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Faculty
        </Button>
      </div>

      {/* Faculty List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : faculty.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No faculty members yet. Add your first member!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map((member) => (
            <div key={member.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-primary" />
                  )}
                </div>
                <button
                  onClick={() => toggleActive(member)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    member.is_active
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {member.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <h3 className="font-display font-bold text-foreground">{member.name}</h3>
              <p className="text-sm text-primary font-medium">{member.designation}</p>
              {member.department && (
                <p className="text-xs text-muted-foreground mt-1">{member.department}</p>
              )}
              {member.qualification && (
                <p className="text-xs text-muted-foreground">{member.qualification}</p>
              )}
              {member.passed_out_college && (
                <p className="text-xs text-muted-foreground">From: {member.passed_out_college}</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openModal(member)}
                  className="flex-1 py-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member)}
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
          <div className="bg-card rounded-2xl shadow-elevated max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-bold text-foreground">
                {editingFaculty ? 'Edit Faculty' : 'Add Faculty'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
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
                  <label className="block text-sm font-medium text-foreground mb-2">Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g., Senior Teacher"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Qualification / Degree</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g., M.Sc Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Passed Out College</label>
                  <input
                    type="text"
                    value={formData.passed_out_college}
                    onChange={(e) => setFormData({ ...formData, passed_out_college: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g., Tribhuvan University"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Phone number"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="Short bio about the teacher"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-foreground">
                  Active (visible on website)
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1" disabled={isUploading}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isUploading}>
                  {isUploading ? 'Saving...' : editingFaculty ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFaculty;