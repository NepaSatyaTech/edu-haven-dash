const router = require('express').Router();
const auth = require('../middleware/auth');
const { Mark, Subject } = require('../models');

const calcGrade = (full, obtained) => {
  const p = (obtained / full) * 100;
  if (p >= 90) return 'A+';
  if (p >= 80) return 'A';
  if (p >= 70) return 'B+';
  if (p >= 60) return 'B';
  if (p >= 50) return 'C+';
  if (p >= 40) return 'C';
  if (p >= 35) return 'D+';
  if (p >= 32) return 'D';
  return 'E';
};

// GET marks
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.exam_id)    filter.exam_id    = req.query.exam_id;
    if (req.query.student_id) filter.student_id = req.query.student_id;
    const marks = await Mark.find(filter).populate('subject_id').lean({ virtuals: true });
    res.json(marks.map(m => ({ ...m, id: m._id, subjects: m.subject_id })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPSERT marks
router.post('/upsert', auth, async (req, res) => {
  try {
    const entries = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    for (const entry of entries) {
      const { student_id, exam_id, subject_id, marks_obtained, remarks } = entry;
      let grade = null;
      if (marks_obtained != null) {
        const subj = await Subject.findById(subject_id);
        if (subj) grade = calcGrade(subj.full_marks, marks_obtained);
      }
      const doc = await Mark.findOneAndUpdate(
        { student_id, exam_id, subject_id },
        { marks_obtained, grade, remarks, updated_at: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      results.push(doc);
    }
    res.json(results);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    await Mark.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
