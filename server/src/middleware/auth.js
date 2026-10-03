const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, userId: true, name: true, role: true, createdAt: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User session invalid or user deleted' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
