import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useClasses, useSections, useCreateStudent } from '@/hooks/useStudentManagement';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus, Upload, Loader2, X } from 'lucide-react';

const admissionSchema = z.object({
  full_name: z.string().min(2, 'Full name is required').max(100),
  father_name: z.string().min(2, "Father's name is required").max(100),
  mother_name: z.string().min(2, "Mother's name is required").max(100),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(10, 'Valid phone number required').max(15),
  address: z.string().min(5, 'Address is required').max(255),
  class_id: z.string().min(1, 'Class is required'),
  section_id: z.string().min(1, 'Section is required'),
  previous_school: z.string().optional(),
  is_fresher: z.boolean().default(false),
  email: z.string().email().optional().or(z.literal('')),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

interface TeacherAdmissionFormProps {
  onSuccess?: () => void;
}

export function TeacherAdmissionForm({ onSuccess }: TeacherAdmissionFormProps) {
  const [open, setOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  
  const { data: classes = [] } = useClasses();
  const createStudent = useCreateStudent();
  
  const form = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      full_name: '',
      father_name: '',
      mother_name: '',
      gender: undefined,
      date_of_birth: '',
      phone: '',
      address: '',
      class_id: '',
      section_id: '',
      previous_school: '',
      is_fresher: false,
      email: '',
    },
  });

  const selectedClassId = form.watch('class_id');
  const dateOfBirth = form.watch('date_of_birth');
  const isFresher = form.watch('is_fresher');

  const { data: sections = [] } = useSections(selectedClassId || undefined);

  // Calculate age when date of birth changes
  useEffect(() => {
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [dateOfBirth]);

  // Reset section when class changes
  useEffect(() => {
    form.setValue('section_id', '');
  }, [selectedClassId, form]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const uploadPhoto = async (studentId: string): Promise<string | null> => {
    if (!photoFile) return null;

    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${studentId}.${fileExt}`;
    const filePath = `student-photos/${fileName}`;

    const { error } = await supabase.storage
      .from('student-photos')
      .upload(filePath, photoFile, { upsert: true });

    if (error) {
      console.error('Error uploading photo:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('student-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (data: AdmissionFormData) => {
    setIsUploading(true);
    
    try {
      // Create student first
      const result = await createStudent.mutateAsync({
        full_name: data.full_name.trim(),
        father_name: data.father_name.trim(),
        mother_name: data.mother_name.trim(),
        date_of_birth: data.date_of_birth,
        class_id: data.class_id,
        section_id: data.section_id,
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        address: data.address.trim(),
        status: 'active',
      });

      // Upload photo if provided
      if (photoFile && result?.id) {
        const photoUrl = await uploadPhoto(result.id);
        if (photoUrl) {
          await supabase
            .from('students')
            .update({ photo_url: photoUrl })
            .eq('id', result.id);
        }
      }

      toast.success('Student admitted successfully!');
      form.reset();
      setPhotoFile(null);
      setPhotoPreview(null);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error admitting student:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          New Admission
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Student Admission Form
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Photo Upload */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {photoPreview ? (
                  <div className="relative w-24 h-28 rounded-lg overflow-hidden border-2 border-primary/30">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-24 h-28 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1 text-sm text-muted-foreground">
                <p>Upload student photo</p>
                <p className="text-xs">JPG, PNG up to 5MB</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="father_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter father's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mother_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother's Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mother's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Age</FormLabel>
                <Input 
                  value={age !== null ? `${age} years` : ''} 
                  disabled 
                  className="bg-muted"
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Class Selection */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="section_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!selectedClassId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            Section {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Previous School */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_fresher"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Fresher (No previous school)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {!isFresher && (
                <FormField
                  control={form.control}
                  name="previous_school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous School</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter previous school name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || createStudent.isPending}>
                {(isUploading || createStudent.isPending) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Admitting...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Admit Student
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
