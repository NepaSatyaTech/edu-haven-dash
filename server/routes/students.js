const router = require('express').Router();
const auth = require('../middleware/auth');
const { Student } = require('../models');

const genStudentId = (roll) => {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `STU${year}${rand}${roll.toString().padStart(3, '0')}`;
};

// LIST
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.class_id)   filter.class_id   = req.query.class_id;
    if (req.query.section_id) filter.section_id = req.query.section_id;
    if (req.query.search) {
      filter.$or = [
        { full_name:  { $regex: req.query.search, $options: 'i' } },
        { student_id: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const students = await Student.find(filter)
      .populate('class_id',   'id name grade_level')
      .populate('section_id', 'id name')
      .sort({ roll_number: 1 })
      .lean({ virtuals: true });

    res.json(students.map(s => ({ ...s, id: s._id, classes: s.class_id, sections: s.section_id })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// NEXT ROLL — must be before /:id
router.get('/next-roll/:classId/:sectionId', auth, async (req, res) => {
  try {
    const last = await Student.findOne({
      class_id:   req.params.classId,
      section_id: req.params.sectionId,
    }).sort({ roll_number: -1 });
    res.json({ roll_number: last ? last.roll_number + 1 : 1 });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET ONE
router.get('/:id', auth, async (req, res) => {
  try {
    const s = await Student.findById(req.params.id)
      .populate('class_id',   'id name grade_level')
      .populate('section_id', 'id name')
      .lean({ virtuals: true });
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json({ ...s, id: s._id, classes: s.class_id, sections: s.section_id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// BULK CREATE
router.post('/bulk', auth, async (req, res) => {
  try {
    const { students } = req.body;
    const created = [];
    for (const s of students) {
      let { roll_number, student_id, class_id, section_id } = s;
      if (!roll_number) {
        const last = await Student.findOne({ class_id, section_id }).sort({ roll_number: -1 });
        roll_number = last ? last.roll_number + 1 : 1;
      }
      if (!student_id) student_id = genStudentId(roll_number);
      created.push(await Student.create({ ...s, roll_number, student_id }));
    }
    res.status(201).json(created);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    let { roll_number, student_id, class_id, section_id } = req.body;
    if (!roll_number) {
      const last = await Student.findOne({ class_id, section_id }).sort({ roll_number: -1 });
      roll_number = last ? last.roll_number + 1 : 1;
    }
    if (!student_id) student_id = genStudentId(roll_number);
    const student = await Student.create({ ...req.body, roll_number, student_id });
    res.status(201).json(student);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    const doc = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router };
