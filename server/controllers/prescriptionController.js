const Prescription = require('../models/Prescription');

const ALLOWED_STATUS = ['active', 'pending', 'expired'];

// GET /api/prescriptions?status=active|pending|expired
exports.list = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.userId };
    if (status) {
      if (!ALLOWED_STATUS.includes(status)) return res.status(400).json({ message: 'Invalid status' });
      filter.status = status;
    }
    const items = await Prescription.find(filter).sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('List prescriptions error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/prescriptions
exports.create = async (req, res) => {
  try {
    const {
      name,
      doctor,
      rxNumber,
      prescribedAt,
      nextRefillAt,
      expiredAt,
      refillsLeft = 0,
      status = 'pending',
      note,
    } = req.body || {};

    if (!name || !doctor || !rxNumber || !prescribedAt) {
      return res.status(400).json({ message: 'name, doctor, rxNumber, prescribedAt are required' });
    }
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

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
      note,
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
