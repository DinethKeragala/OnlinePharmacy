const Order = require('../models/Order');

exports.getMonthlySales = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

    const [result] = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const total = result?.total || 0;
    res.json({ month: now.getUTCMonth() + 1, year: now.getUTCFullYear(), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
