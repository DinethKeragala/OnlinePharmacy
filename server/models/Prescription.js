const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  doctor: { type: String, required: true },
  rxNumber: { type: String, required: true },
  prescribedAt: { type: Date, required: true },
  nextRefillAt: { type: Date },
  expiredAt: { type: Date },
  refillsLeft: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'expired'], required: true, index: true },
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
