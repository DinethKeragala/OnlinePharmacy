const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  // optional linkage context
  kind: { type: String, enum: ['product', 'health'], default: 'product' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: { type: [orderItemSchema], required: true },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  payment: { type: String, enum: ['bank', 'cod'], default: 'cod' },
  status: { type: String, enum: ['placed', 'paid', 'shipped', 'cancelled'], default: 'placed' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
