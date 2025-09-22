const Prescription = require('../models/Prescription');
const { isValidObjectId, toFiniteNumber } = require('../utils/safeQuery');

const ALLOWED_STATUS = ['active', 'pending', 'expired'];

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

    const body = req.body || {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const doctor = typeof body.doctor === 'string' ? body.doctor.trim() : '';
    const rxNumber = typeof body.rxNumber === 'string' ? body.rxNumber.trim() : '';
    // Do NOT allow clients to set status on creation; always start as 'pending'
    const status = 'pending';
    const note = typeof body.note === 'string' ? body.note.trim() : undefined;

    if (!name || !doctor || !rxNumber || !body.prescribedAt) {
      return res.status(400).json({ message: 'name, doctor, rxNumber, prescribedAt are required' });
    }
    // status is server-controlled ('pending'); no validation of client-provided status needed

    // Basic rxNumber whitelist: letters, numbers, dash, up to 64 chars
    if (!/^[A-Za-z0-9-]{1,64}$/.test(rxNumber)) {
      return res.status(400).json({ message: 'Invalid rxNumber format' });
    }

    // Parse and validate dates
    const prescribedAt = new Date(body.prescribedAt);
    if (isNaN(prescribedAt.getTime())) return res.status(400).json({ message: 'Invalid prescribedAt' });
    let nextRefillAt;
    if (body.nextRefillAt) {
      const d = new Date(body.nextRefillAt);
      if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid nextRefillAt' });
      nextRefillAt = d;
    }
    let expiredAt;
    if (body.expiredAt) {
      const d = new Date(body.expiredAt);
      if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid expiredAt' });
      expiredAt = d;
    }

    // Coerce refillsLeft to non-negative integer
    const rlNum = toFiniteNumber(body.refillsLeft);
    const refillsLeft = Math.max(0, Math.floor(rlNum ?? 0));

    // Cap note length to prevent abuse
    const safeNote = typeof note === 'string' ? note.slice(0, 1000) : undefined;

    // Create document using only whitelisted, sanitized fields (ignore raw req.body)
    const doc = await Prescription.create({
      user: req.userId,
      name,
      doctor,
      rxNumber,
      prescribedAt,
      nextRefillAt,
      expiredAt,
      refillsLeft,
      status,
      note: safeNote,
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error('Create prescription error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/prescriptions/:id/request-refill
exports.requestRefill = async (req, res) => {
  try {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await Prescription.findOne({ _id: id, user: req.userId });
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
