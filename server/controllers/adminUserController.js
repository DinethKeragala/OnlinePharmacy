const User = require('../models/User');
const Prescription = require('../models/Prescription');
const { safeRegexContains } = require('../utils/safeQuery');

exports.list = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(Math.max(1, Number(req.query.limit) || 20), 100);
    const skip = (page - 1) * limit;
    const q = req.query.q && String(req.query.q).trim();

    const userFilter = {};
    if (q) {
      const rx = safeRegexContains(String(q).slice(0, 128));
      userFilter.$or = [ { name: rx }, { email: rx } ];
    }

    const [total, users] = await Promise.all([
      User.countDocuments(userFilter),
      User.find(userFilter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('_id name email createdAt')
    ]);

    const ids = users.map(u => u._id);
    let statsByUser = new Map();
    if (ids.length) {
      const agg = await Prescription.aggregate([
        { $match: { user: { $in: ids } } },
        { $group: {
          _id: '$user',
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } },
          total: { $sum: 1 },
          lastUpdated: { $max: '$updatedAt' },
        } }
      ]);
      statsByUser = new Map(agg.map(r => [String(r._id), r]));
    }

    const data = users.map(u => {
      const s = statsByUser.get(String(u._id)) || { active: 0, pending: 0, expired: 0, total: 0, lastUpdated: null };
      return {
        user: { id: u._id, name: u.name, email: u.email },
        stats: {
          approved: s.active || 0,
          pending: s.pending || 0,
          rejected: s.expired || 0,
          total: s.total || 0,
          lastUpdated: s.lastUpdated,
        },
      }
    });

    res.json({ data, page, pages: Math.ceil(total / limit) || 1, total });
  } catch (err) {
    console.error('Admin list users error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
