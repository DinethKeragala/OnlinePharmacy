const mongoose = require('mongoose');

function escapeRegex(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function safeRegexContains(input) {
  // Trim overly long inputs to limit regex engine work
  const raw = String(input || '').slice(0, 128);
  const pattern = escapeRegex(raw);
  // If empty after trimming/escaping, return a regex that matches nothing
  if (!pattern) return { $regex: '(?!)' };
  return { $regex: pattern, $options: 'i' };
}

function normalizeEmail(input) {
  if (typeof input !== 'string') return null;
  const e = input.trim().toLowerCase().slice(0, 254);
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
