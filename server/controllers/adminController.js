const User = require('../models/User');
const { verifyPassword, signToken, verifyToken } = require('../utils/auth');
const { normalizeEmail } = require('../utils/safeQuery');

exports.login = async (req, res) => {
  try {
  const { username, password } = req.body || {};
  const em = normalizeEmail(username);
  if (!em || !password) return res.status(400).json({ message: 'Missing credentials' });
  const user = await User.findOne().where('email').equals(em).where('role').equals('admin');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken({ sub: user._id.toString(), email: user.email, role: 'admin' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
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
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const user = await User.findById(payload.sub).select('_id name email role createdAt');
    if (!user) return res.status(404).json({ message: 'Admin not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
