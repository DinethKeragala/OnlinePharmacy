const mongoose = require('mongoose');

const healthProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  genericName: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  imageUrl: { type: String },
  inStock: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('HealthProduct', healthProductSchema);
