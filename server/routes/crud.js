const router = require('express').Router;
const auth = require('../middleware/auth');

const crudRouter = (Model, opts = {}) => {
  const r = router();
  const { publicRead = false, populate = [] } = opts;
  const readMw = publicRead ? [] : [auth];

  // LIST
  r.get('/', ...readMw, async (req, res) => {
    try {
      let filter = {};
      if (req.query.filter) { try { filter = JSON.parse(req.query.filter); } catch {} }
      let q = Model.find(filter);
      populate.forEach(p => { q = q.populate(p); });
      if (req.query.sort) q = q.sort(req.query.sort);
      const data = await q.lean({ virtuals: true });
      res.json(data.map(d => ({ ...d, id: d._id })));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // GET ONE
  r.get('/:id', ...readMw, async (req, res) => {
    try {
      let q = Model.findById(req.params.id);
      populate.forEach(p => { q = q.populate(p); });
      const doc = await q.lean({ virtuals: true });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json({ ...doc, id: doc._id });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // CREATE
  r.post('/', auth, async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  // UPDATE
  r.put('/:id', auth, async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updated_at: new Date() },
        { new: true, runValidators: true }
      );
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json(doc);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  // DELETE
  r.delete('/:id', auth, async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  return r;
};

module.exports = crudRouter;
