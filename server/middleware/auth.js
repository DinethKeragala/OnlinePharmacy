const { verifyToken } = require('../utils/auth');

module.exports = function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
