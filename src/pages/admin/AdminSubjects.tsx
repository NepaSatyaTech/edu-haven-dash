import { useState } from 'react';
import { useSubjects, useClasses, useClassSubjects } from '@/hooks/useStudentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Edit, Book, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name is required'),
  code: z.string().min(2, 'Subject code is required').max(10),
  full_marks: z.number().min(1).max(200),
  pass_marks: z.number().min(1),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

const AdminSubjects = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: classes = [] } = useClasses();
  const { data: subjects = [], isLoading } = useSubjects();
  const { data: classSubjects = [] } = useClassSubjects(selectedClass || undefined);

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      code: '',
      full_marks: 100,
      pass_marks: 32,
    },
  });

  const assignedSubjectIds = classSubjects.map(cs => cs.subject_id);

  const handleAddSubject = async (data: SubjectFormData) => {
    const { error } = await supabase
      .from('subjects')
      .insert([{ name: data.name, code: data.code, full_marks: data.full_marks, pass_marks: data.pass_marks }]);
    
    if (error) {
      toast.error(`Failed to add subject: ${error.message}`);
      return;
    }
    
    toast.success('Subject added successfully!');
    queryClient.invalidateQueries({ queryKey: ['subjects'] });
    setIsAddDialogOpen(false);
    form.reset();
  };

  const toggleSubjectAssignment = async (subjectId: string, isAssigned: boolean) => {
    if (!selectedClass) return;

    if (isAssigned) {
      // Remove assignment
      const { error } = await supabase
        .from('class_subjects')
        .delete()
        .eq('class_id', selectedClass)
        .eq('subject_id', subjectId);
      
      if (error) {
        toast.error(`Failed to remove subject: ${error.message}`);
        return;
      }
      toast.success('Subject removed from class');
    } else {
      // Add assignment
      const { error } = await supabase
        .from('class_subjects')
        .insert([{ class_id: selectedClass, subject_id: subjectId }]);
      
      if (error) {
        toast.error(`Failed to assign subject: ${error.message}`);
        return;
      }
      toast.success('Subject assigned to class');
    }
    
    queryClient.invalidateQueries({ queryKey: ['class-subjects', selectedClass] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Book className="h-6 w-6" />
            Subject Management
          </h1>
          <p className="text-muted-foreground">Manage subjects and assign them to classes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddSubject)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mathematics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., MATH" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="full_marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Marks</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pass_marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pass Marks</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Subject</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Class Filter for Assignment */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium mb-3">Assign Subjects to Class</h3>
        <Select value={selectedClass || 'none'} onValueChange={(v) => setSelectedClass(v === 'none' ? '' : v)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a class to manage subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select Class</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subjects Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-center">Full Marks</TableHead>
              <TableHead className="text-center">Pass Marks</TableHead>
              {selectedClass && <TableHead className="text-center">Assigned</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={selectedClass ? 5 : 4} className="text-center py-8">
                  Loading subjects...
                </TableCell>
              </TableRow>
            ) : subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={selectedClass ? 5 : 4} className="text-center py-8 text-muted-foreground">
                  No subjects found
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((subject) => {
                const isAssigned = assignedSubjectIds.includes(subject.id);
                return (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{subject.code}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{subject.full_marks}</TableCell>
                    <TableCell className="text-center">{subject.pass_marks}</TableCell>
                    {selectedClass && (
                      <TableCell className="text-center">
                        <Button
                          variant={isAssigned ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleSubjectAssignment(subject.id, isAssigned)}
                        >
                          {isAssigned ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Assigned
                            </>
                          ) : (
                            'Assign'
                          )}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedClass && (
        <div className="text-sm text-muted-foreground">
          Tip: Click "Assign" to add a subject to the selected class, or "Assigned" to remove it.
        </div>
      )}
    </div>
  );
};

export default AdminSubjects;
