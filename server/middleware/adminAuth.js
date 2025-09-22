const { verifyToken } = require('../utils/auth');

// Admin-only auth middleware
module.exports = function adminAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = verifyToken(token);
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
