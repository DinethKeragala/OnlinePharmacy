const Prescription = require('../models/Prescription');
const { isValidObjectId, toFiniteNumber } = require('../utils/safeQuery');

const ALLOWED_STATUS = ['active', 'pending', 'expired'];

// Helper to tag bad-request validation errors
function badRequest(message) {
  const e = new Error(message);
  e.status = 400;
  return e;
}

function sanitizeCreateInput(body) {
  const src = body || {};
  const name = typeof src.name === 'string' ? src.name.trim() : '';
  const doctor = typeof src.doctor === 'string' ? src.doctor.trim() : '';
  const rxNumber = typeof src.rxNumber === 'string' ? src.rxNumber.trim() : '';
  const note = typeof src.note === 'string' ? src.note.trim() : undefined;

  if (!name || !doctor || !rxNumber || !src.prescribedAt) {
    throw badRequest('name, doctor, rxNumber, prescribedAt are required');
  }
  if (!/^[A-Za-z0-9-]{1,64}$/.test(rxNumber)) {
    throw badRequest('Invalid rxNumber format');
  }

  const prescribedAt = new Date(src.prescribedAt);
  if (isNaN(prescribedAt.getTime())) throw badRequest('Invalid prescribedAt');

  let nextRefillAt;
  if (src.nextRefillAt) {
    const d = new Date(src.nextRefillAt);
    if (isNaN(d.getTime())) throw badRequest('Invalid nextRefillAt');
    nextRefillAt = d;
  }

  let expiredAt;
  if (src.expiredAt) {
    const d = new Date(src.expiredAt);
    if (isNaN(d.getTime())) throw badRequest('Invalid expiredAt');
    expiredAt = d;
  }

  const rlNum = toFiniteNumber(src.refillsLeft);
  const refillsLeft = Math.max(0, Math.floor(rlNum ?? 0));
  const safeNote = typeof note === 'string' ? note.slice(0, 1000) : undefined;

  return {
    name,
    doctor,
    rxNumber,
    prescribedAt,
    nextRefillAt,
    expiredAt,
    refillsLeft,
    // force server-controlled status
    status: 'pending',
    note: safeNote,
  };
}

// GET /api/prescriptions?status=active|pending|expired
exports.list = async (req, res) => {
  try {
    const { status } = req.query;

    // Validate user id extracted from auth middleware
    if (!isValidObjectId(req.userId)) return res.status(401).json({ message: 'Invalid user' });

    // Build a fixed-field query chain; do not construct from raw user input
    let query = Prescription.find().where('user').equals(req.userId);
    if (status) {
      if (!ALLOWED_STATUS.includes(status)) return res.status(400).json({ message: 'Invalid status' });
      query = query.where('status').equals(status);
    }
    const items = await query.sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('List prescriptions error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/prescriptions
exports.create = async (req, res) => {
  try {
    if (!isValidObjectId(req.userId)) return res.status(401).json({ message: 'Invalid user' });

    const payload = sanitizeCreateInput(req.body);
    const doc = await Prescription.create({ user: req.userId, ...payload });
    res.status(201).json(doc);
  } catch (err) {
    console.error('Create prescription error', err);
    if (err && err.status === 400) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/prescriptions/:id/request-refill
exports.requestRefill = async (req, res) => {
  try {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  if (!isValidObjectId(req.userId)) return res.status(401).json({ message: 'Invalid user' });
    const doc = await Prescription.findOne()
      .where('_id').equals(id)
      .where('user').equals(req.userId);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    if (doc.status !== 'active') return res.status(400).json({ message: 'Only active prescriptions can be refilled' });
    if (doc.refillsLeft <= 0) return res.status(400).json({ message: 'No refills left' });

    doc.refillsLeft -= 1;
    // Bump nextRefillAt ~30 days by default
    const base = doc.nextRefillAt ? new Date(doc.nextRefillAt) : new Date();
    base.setDate(base.getDate() + 30);
    doc.nextRefillAt = base;
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error('Request refill error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
