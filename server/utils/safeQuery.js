const mongoose = require('mongoose');

function escapeRegex(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function safeRegexContains(input) {
  const pattern = escapeRegex(String(input || ''));
  return { $regex: pattern, $options: 'i' };
}

function normalizeEmail(input) {
  if (typeof input !== 'string') return null;
  const e = input.trim().toLowerCase();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  return ok ? e : null;
}

function isValidObjectId(id) {
  return mongoose.isValidObjectId(id);
}

function toFiniteNumber(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

module.exports = { escapeRegex, safeRegexContains, normalizeEmail, isValidObjectId, toFiniteNumber };
