require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');

const app = express();

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅  MongoDB connected:', process.env.MONGODB_URI))
  .catch(err => { console.error('❌  MongoDB error:', err.message); process.exit(1); });

// ── Models ────────────────────────────────────────────────────────────────────
const {
  AcademicYear, Class, Section, Subject, ClassSubject,
  Exam, Notice, Event, Gallery, Faculty, Testimonial,
  SiteSetting, ContactSubmission, AdmissionInquiry, Attendance,
} = require('./models');

const crudRouter = require('./routes/crud');
const auth       = require('./middleware/auth');

// ── Auth ──────────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/students', require('./routes/students').router);
app.use('/api/marks',    require('./routes/marks'));
app.use('/api/upload',   require('./routes/upload'));

// ── Generic CRUD ──────────────────────────────────────────────────────────────
app.use('/api/classes',             crudRouter(Class,            { publicRead: false }));
app.use('/api/sections',            crudRouter(Section,          { publicRead: false }));
app.use('/api/subjects',            crudRouter(Subject,          { publicRead: false }));
app.use('/api/class-subjects',      crudRouter(ClassSubject,     { publicRead: false, populate: ['subject_id'] }));
app.use('/api/academic-years',      crudRouter(AcademicYear,     { publicRead: false }));
app.use('/api/exams',               crudRouter(Exam,             { publicRead: false, populate: ['academic_year_id', 'class_id'] }));
app.use('/api/attendance',          crudRouter(Attendance,       { publicRead: false }));
app.use('/api/notices',             crudRouter(Notice,           { publicRead: true  }));
app.use('/api/events',              crudRouter(Event,            { publicRead: true  }));
app.use('/api/gallery',             crudRouter(Gallery,          { publicRead: true  }));
app.use('/api/faculty',             crudRouter(Faculty,          { publicRead: true  }));
app.use('/api/testimonials',        crudRouter(Testimonial,      { publicRead: true  }));
app.use('/api/site-settings',       crudRouter(SiteSetting,      { publicRead: true  }));
app.use('/api/contact-submissions', crudRouter(ContactSubmission,{ publicRead: false }));
app.use('/api/admission-inquiries', crudRouter(AdmissionInquiry, { publicRead: false }));

// ── Public form submissions ───────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  try { res.status(201).json(await ContactSubmission.create(req.body)); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/admissions', async (req, res) => {
  try { res.status(201).json(await AdmissionInquiry.create(req.body)); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

// ── Dashboard stats ───────────────────────────────────────────────────────────
app.get('/api/dashboard/stats', auth, async (req, res) => {
  try {
    const [notices, events, gallery, faculty, messages, admissions, unreadMessages, pendingAdmissions] =
      await Promise.all([
        Notice.countDocuments(),
        Event.countDocuments(),
        Gallery.countDocuments(),
        Faculty.countDocuments(),
        ContactSubmission.countDocuments(),
        AdmissionInquiry.countDocuments(),
        ContactSubmission.countDocuments({ is_read: false }),
        AdmissionInquiry.countDocuments({ status: 'pending' }),
      ]);
    res.json({ notices, events, gallery, faculty, messages, admissions, unreadMessages, pendingAdmissions });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
