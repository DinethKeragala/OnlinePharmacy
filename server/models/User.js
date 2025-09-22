const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
