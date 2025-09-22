const User = require('../models/User');
const { hashPassword, verifyPassword, signToken, verifyToken } = require('../utils/auth');
const { isValidObjectId } = require('../utils/safeQuery');

function normalizeEmail(input) {
  if (typeof input !== 'string') return null;
  const e = input.trim().toLowerCase();
  // Minimal email sanity check to avoid selector injection and invalid values
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  return ok ? e : null;
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const nm = typeof name === 'string' ? name.trim() : '';
    const em = normalizeEmail(email);
    const pw = typeof password === 'string' ? password : '';
    if (!nm || !em || !pw) return res.status(400).json({ message: 'Missing or invalid fields' });

    // Avoid constructing queries from raw body: use fixed field and equals() with normalized value
    const existing = await User.findOne().where('email').equals(em);
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const { hash, salt } = hashPassword(pw);
    const user = await User.create({ name: nm, email: em, passwordHash: hash, passwordSalt: salt });
    const token = signToken({ sub: user._id.toString(), email: user.email });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const em = normalizeEmail(email);
    const pw = typeof password === 'string' ? password : '';
    if (!em || !pw) return res.status(400).json({ message: 'Missing credentials' });

    // Fixed-field equals() with normalized value
    const user = await User.findOne().where('email').equals(em);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const ok = verifyPassword(pw, user.passwordSalt, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });
    const token = signToken({ sub: user._id.toString(), email: user.email });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token' });
    const payload = verifyToken(token);
    if (!isValidObjectId(payload.sub)) return res.status(401).json({ message: 'Invalid token' });
    const user = await User.findById(payload.sub).select('_id name email createdAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
