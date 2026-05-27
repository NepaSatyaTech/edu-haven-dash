const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const id = { type: String, default: uuidv4 };
const ts = { type: Date, default: Date.now };

const toJSON = {
  virtuals: true, versionKey: false,
  transform: (_, r) => { r.id = r._id; delete r._id; return r; }
};

// User
const UserSchema = new mongoose.Schema({
  _id: id, email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'moderator'], default: 'admin' },
  created_at: ts,
});
UserSchema.set('toJSON', { ...toJSON, transform: (_, r) => { r.id = r._id; delete r._id; delete r.password; return r; } });

// AcademicYear
const AcademicYearSchema = new mongoose.Schema({
  _id: id, name: { type: String, required: true, unique: true },
  start_date: String, end_date: String,
  is_current: { type: Boolean, default: false }, created_at: ts,
});
AcademicYearSchema.set('toJSON', toJSON);

// Class
const ClassSchema = new mongoose.Schema({
  _id: id, name: { type: String, required: true, unique: true },
  grade_level: { type: Number, required: true, unique: true, min: 1, max: 12 }, created_at: ts,
});
ClassSchema.set('toJSON', toJSON);

// Section
const SectionSchema = new mongoose.Schema({
  _id: id, class_id: { type: String, ref: 'Class', required: true },
  name: { type: String, required: true }, created_at: ts,
});
SectionSchema.index({ class_id: 1, name: 1 }, { unique: true });
SectionSchema.set('toJSON', toJSON);

// Subject
const SubjectSchema = new mongoose.Schema({
  _id: id, name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  full_marks: { type: Number, default: 100 }, pass_marks: { type: Number, default: 32 }, created_at: ts,
});
SubjectSchema.set('toJSON', toJSON);

// ClassSubject
const ClassSubjectSchema = new mongoose.Schema({
  _id: id, class_id: { type: String, ref: 'Class', required: true },
  subject_id: { type: String, ref: 'Subject', required: true }, created_at: ts,
});
ClassSubjectSchema.index({ class_id: 1, subject_id: 1 }, { unique: true });
ClassSubjectSchema.set('toJSON', toJSON);

// Student
const StudentSchema = new mongoose.Schema({
  _id: id, student_id: { type: String, required: true, unique: true },
  full_name: { type: String, required: true }, father_name: { type: String, required: true },
  mother_name: { type: String, required: true }, date_of_birth: String,
  class_id: { type: String, ref: 'Class', required: true },
  section_id: { type: String, ref: 'Section', required: true },
  roll_number: { type: Number, required: true },
  phone: String, email: String, address: String, photo_url: String,
  admission_id: { type: String, ref: 'AdmissionInquiry', default: null },
  status: { type: String, enum: ['active', 'inactive', 'graduated', 'transferred'], default: 'active' },
  created_at: ts, updated_at: ts,
});
StudentSchema.index({ class_id: 1, section_id: 1, roll_number: 1 }, { unique: true });
StudentSchema.set('toJSON', toJSON);

// Exam
const ExamSchema = new mongoose.Schema({
  _id: id, name: { type: String, required: true },
  exam_type: { type: String, enum: ['first_terminal', 'second_terminal', 'final'], required: true },
  academic_year_id: { type: String, ref: 'AcademicYear', required: true },
  class_id: { type: String, ref: 'Class', required: true },
  start_date: String, end_date: String,
  is_published: { type: Boolean, default: false }, created_at: ts, updated_at: ts,
});
ExamSchema.set('toJSON', toJSON);

// Mark
const MarkSchema = new mongoose.Schema({
  _id: id, student_id: { type: String, ref: 'Student', required: true },
  exam_id: { type: String, ref: 'Exam', required: true },
  subject_id: { type: String, ref: 'Subject', required: true },
  marks_obtained: Number,
  grade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E', null], default: null },
  remarks: String, created_at: ts, updated_at: ts,
});
MarkSchema.index({ student_id: 1, exam_id: 1, subject_id: 1 }, { unique: true });
MarkSchema.set('toJSON', toJSON);

// Attendance
const AttendanceSchema = new mongoose.Schema({
  _id: id, student_id: { type: String, ref: 'Student', required: true },
  class_id: { type: String, ref: 'Class', required: true },
  section_id: { type: String, ref: 'Section', required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, required: true },
  marked_by: String, remarks: String, created_at: ts, updated_at: ts,
});
AttendanceSchema.set('toJSON', toJSON);

// Notice
const NoticeSchema = new mongoose.Schema({
  _id: id, title: { type: String, required: true }, content: String,
  category: { type: String, default: 'general' },
  is_published: { type: Boolean, default: false }, created_at: ts, updated_at: ts,
});
NoticeSchema.set('toJSON', toJSON);

// Event
const EventSchema = new mongoose.Schema({
  _id: id, title: { type: String, required: true }, description: String,
  event_date: String, location: String,
  is_published: { type: Boolean, default: false }, created_at: ts, updated_at: ts,
});
EventSchema.set('toJSON', toJSON);

// Gallery
const GallerySchema = new mongoose.Schema({
  _id: id, title: { type: String, required: true },
  image_url: { type: String, required: true },
  category: { type: String, default: 'general' },
  is_published: { type: Boolean, default: true }, created_at: ts,
});
GallerySchema.set('toJSON', toJSON);

// Faculty
const FacultySchema = new mongoose.Schema({
  _id: id, name: { type: String, required: true }, designation: { type: String, required: true },
  department: String, qualification: String, bio: String, email: String, phone: String,
  image_url: String, passed_out_college: String,
  display_order: { type: Number, default: 0 }, is_active: { type: Boolean, default: true },
  created_at: ts, updated_at: ts,
});
FacultySchema.set('toJSON', toJSON);

// Testimonial
const TestimonialSchema = new mongoose.Schema({
  _id: id, name: { type: String, required: true }, role_en: String, role_ne: String,
  content_en: { type: String, required: true }, content_ne: String, initials: String,
  rating: { type: Number, default: 5 }, display_order: { type: Number, default: 0 },
  is_published: { type: Boolean, default: true }, created_at: ts, updated_at: ts,
});
TestimonialSchema.set('toJSON', toJSON);

// SiteSetting
const SiteSettingSchema = new mongoose.Schema({
  _id: id, key: { type: String, required: true, unique: true },
  value_en: { type: String, required: true }, value_ne: String, created_at: ts, updated_at: ts,
});
SiteSettingSchema.set('toJSON', toJSON);

// ContactSubmission
const ContactSubmissionSchema = new mongoose.Schema({
  _id: id, name: { type: String, required: true }, email: { type: String, required: true },
  phone: String, subject: { type: String, required: true }, message: { type: String, required: true },
  is_read: { type: Boolean, default: false }, created_at: ts,
});
ContactSubmissionSchema.set('toJSON', toJSON);

// AdmissionInquiry
const AdmissionInquirySchema = new mongoose.Schema({
  _id: id, student_name: { type: String, required: true }, parent_name: { type: String, required: true },
  email: { type: String, required: true }, phone: { type: String, required: true },
  grade: { type: String, required: true }, message: String,
  status: { type: String, default: 'pending' }, is_read: { type: Boolean, default: false }, created_at: ts,
});
AdmissionInquirySchema.set('toJSON', toJSON);

module.exports = {
  User:               mongoose.model('User', UserSchema),
  AcademicYear:       mongoose.model('AcademicYear', AcademicYearSchema),
  Class:              mongoose.model('Class', ClassSchema),
  Section:            mongoose.model('Section', SectionSchema),
  Subject:            mongoose.model('Subject', SubjectSchema),
  ClassSubject:       mongoose.model('ClassSubject', ClassSubjectSchema),
  Student:            mongoose.model('Student', StudentSchema),
  Exam:               mongoose.model('Exam', ExamSchema),
  Mark:               mongoose.model('Mark', MarkSchema),
  Attendance:         mongoose.model('Attendance', AttendanceSchema),
  Notice:             mongoose.model('Notice', NoticeSchema),
  Event:              mongoose.model('Event', EventSchema),
  Gallery:            mongoose.model('Gallery', GallerySchema),
  Faculty:            mongoose.model('Faculty', FacultySchema),
  Testimonial:        mongoose.model('Testimonial', TestimonialSchema),
  SiteSetting:        mongoose.model('SiteSetting', SiteSettingSchema),
  ContactSubmission:  mongoose.model('ContactSubmission', ContactSubmissionSchema),
  AdmissionInquiry:   mongoose.model('AdmissionInquiry', AdmissionInquirySchema),
};
