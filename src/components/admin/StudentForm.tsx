import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClasses, useSections, useCreateStudent, useUpdateStudent, Student } from '@/hooks/useStudentManagement';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, User, X, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';



const studentSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  father_name: z.string().min(2, 'Father name is required').max(100),
  mother_name: z.string().min(2, 'Mother name is required').max(100),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  class_id: z.string().min(1, 'Class is required'),
  section_id: z.string().min(1, 'Section is required'),
  phone: z.string().max(20).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'graduated', 'transferred']),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: Student;
  onSuccess?: () => void;
}

const StudentForm = ({ student, onSuccess }: StudentFormProps) => {
  const { data: classes = [] } = useClasses();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(student?.photo_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      full_name: student?.full_name || '',
      father_name: student?.father_name || '',
      mother_name: student?.mother_name || '',
      date_of_birth: student?.date_of_birth || '',
      class_id: student?.class_id || '',
      section_id: student?.section_id || '',
      phone: student?.phone || '',
      email: student?.email || '',
      address: student?.address || '',
      status: student?.status || 'active',
    },
  });

  const selectedClassId = form.watch('class_id');
  const { data: sections = [] } = useSections(selectedClassId || undefined);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please ensure camera permissions are granted.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      closeCamera();
      toast.success('Photo captured successfully!');
    }, 'image/jpeg', 0.9);
  };

  const uploadPhoto = async (studentId: string): Promise<string | null> => {
    if (!photoFile) return student?.photo_url || null;

    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${studentId}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('students')
      .upload(filePath, photoFile, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload photo');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('students')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onSubmit = async (data: StudentFormData) => {
    try {
      setIsUploading(true);

      if (student) {
        // Upload photo if new one selected
        let photoUrl = student.photo_url;
        if (photoFile) {
          photoUrl = await uploadPhoto(student.id);
        } else if (!photoPreview && student.photo_url) {
          // Photo was removed
          photoUrl = null;
        }

        await updateStudent.mutateAsync({ 
          id: student.id, 
          ...data,
          phone: data.phone || null,
          email: data.email || null,
          address: data.address || null,
          photo_url: photoUrl,
        });
      } else {
        // Create student first, then upload photo
        const newStudent = await createStudent.mutateAsync({
          full_name: data.full_name,
          father_name: data.father_name,
          mother_name: data.mother_name,
          date_of_birth: data.date_of_birth,
          class_id: data.class_id,
          section_id: data.section_id,
          status: data.status,
          phone: data.phone || null,
          email: data.email || null,
          address: data.address || null,
        });

        // Upload photo if selected
        if (photoFile && newStudent) {
          const photoUrl = await uploadPhoto(newStudent.id);
          if (photoUrl) {
            await updateStudent.mutateAsync({
              id: newStudent.id,
              photo_url: photoUrl,
            });
          }
        }
      }
      onSuccess?.();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = createStudent.isPending || updateStudent.isPending || isUploading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Photo Upload */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Student photo"
                  className="w-32 h-32 rounded-full object-cover border-2 border-border"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-0 right-0 flex gap-1">
                  <label
                    htmlFor="photo-upload"
                    className="bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90"
                    title="Upload from device"
                  >
                    <Upload className="h-3 w-3" />
                  </label>
                  <button
                    type="button"
                    onClick={openCamera}
                    className="bg-secondary text-secondary-foreground rounded-full p-1.5 cursor-pointer hover:bg-secondary/90"
                    title="Take photo from camera"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openCamera}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                  <label htmlFor="photo-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Camera Modal */}
        <Dialog open={isCameraOpen} onOpenChange={(open) => !open && closeCamera()}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Take Photo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  onClick={capturePhoto}
                  size="lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Capture Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCamera}
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student's full name" {...field} />
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
            name="class_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class *</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue('section_id', '');
                }} value={field.value}>
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

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact number" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter full address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {student ? 'Update Student' : 'Register Student'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentForm;
