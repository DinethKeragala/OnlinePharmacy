const Prescription = require('../models/Prescription');
const User = require('../models/User');

// Map UI status to model status
function mapUiToModelStatus(s) {
  if (!s) return undefined;
  const t = String(s).toLowerCase();
  if (t === 'approved' || t === 'active') return 'active';
  if (t === 'pending') return 'pending';
  if (t === 'rejected' || t === 'expired') return 'expired';
  return undefined;
}

exports.list = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(Math.max(1, Number(req.query.limit) || 20), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    const status = mapUiToModelStatus(req.query.status);
    if (status) filter.status = status;
    const q = req.query.q && String(req.query.q).trim();
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { doctor: { $regex: q, $options: 'i' } },
        { rxNumber: { $regex: q, $options: 'i' } },
      ]
    }

    const [total, items] = await Promise.all([
      Prescription.countDocuments(filter),
      Prescription.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', '_id name email')
    ]);

    res.json({ data: items, page, pages: Math.ceil(total / limit) || 1, total });
  } catch (err) {
    console.error('Admin list prescriptions error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Prescription.findById(id).populate('user', '_id name email');
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error('Admin get prescription error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const desired = mapUiToModelStatus(req.body.status);
    if (!desired) return res.status(400).json({ message: 'Invalid status' });

    const doc = await Prescription.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    if (desired === 'active') {
      doc.status = 'active';
      // Ensure nextRefillAt has a value if refills are available
      if (!doc.nextRefillAt) {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        doc.nextRefillAt = d;
      }
    } else if (desired === 'pending') {
      doc.status = 'pending';
    } else if (desired === 'expired') {
      doc.status = 'expired';
      doc.expiredAt = new Date();
    }

    await doc.save();
    const populated = await Prescription.findById(doc._id).populate('user', '_id name email');
    res.json(populated);
  } catch (err) {
    console.error('Admin update prescription status error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
