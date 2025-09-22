const Order = require('../models/Order');
const Product = require('../models/Product');
const HealthProduct = require('../models/HealthProduct');
const { isValidObjectId, toFiniteNumber } = require('../utils/safeQuery');

function badRequest(message) {
  const e = new Error(message);
  e.status = 400;
  return e;
}

async function resolveItem(it) {
  const { id, quantity, kind } = it || {};
  if (!isValidObjectId(id)) throw badRequest('Invalid item id');
  const qtyNum = toFiniteNumber(quantity);
  const qty = qtyNum !== null ? Math.max(1, Math.floor(qtyNum)) : 1;
  let doc = null;
  if (kind === 'health') {
    doc = await HealthProduct.findById(id).select('_id name price');
  } else {
    doc = await Product.findById(id).select('_id name price');
  }
  if (!doc) throw badRequest('Item not found');
  const unitPrice = typeof doc.price === 'number' ? Math.max(0, doc.price) : 0;
  return {
    productId: doc._id,
    name: doc.name,
    unitPrice,
    quantity: qty,
    kind: kind === 'health' ? 'health' : 'product',
    lineTotal: unitPrice * qty,
  };
}

exports.createOrder = async (req, res) => {
  try {
    const { items, payment } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) throw badRequest('No items');

    // Resolve all items via server-side lookups
    const resolved = await Promise.all(items.map(resolveItem));
    const subtotal = resolved.reduce((s, it) => s + it.lineTotal, 0);
    const total = subtotal; // shipping/tax can be added later

    const payload = {
      user: req.userId || undefined,
      items: resolved.map(({ lineTotal, ...keep }) => keep),
      subtotal,
      total,
      payment: payment === 'bank' ? 'bank' : 'cod',
      status: 'placed',
    };

    const saved = await new Order(payload).save();
    return res.status(201).json({ id: saved._id, total: saved.total });
  } catch (err) {
    console.error(err);
    if (err && err.status === 400) return res.status(400).json({ message: err.message });
    return res.status(500).json({ message: 'Server error' });
  }
};
