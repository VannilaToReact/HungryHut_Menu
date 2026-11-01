const { verifyToken } = require('./auth');
const Admin = require('../models/Admin');
const Setting = require('../models/Setting');
const AuditLog = require('../models/AuditLog');

function setCorsHeaders(req, res) {
  const allowedOrigins = (process.env.CLIENT_ORIGIN || 'https://vannilatoreact.github.io,http://localhost:5000,http://localhost:8080,http://localhost:3000')
    .split(',')
    .map(s => s.trim());

  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.github.io')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // handled preflight
  }
  return false;
}

async function requireAdminAuth(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Access denied. No authentication token provided.' });
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      res.status(401).json({ success: false, message: 'Admin account not found or deactivated.' });
      return null;
    }
    return admin;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid authentication token.' });
    }
    return null;
  }
}

async function recordAuditAndSync(action, details, performedBy = 'admin', req = null) {
  try {
    const now = new Date();
    await Setting.findOneAndUpdate(
      { key: 'sync_state' },
      {
        $inc: { 'value.version': 1 },
        $set: { 'value.lastUpdated': now }
      },
      { upsert: true, new: true }
    );

    const ip = req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '') : '';
    await AuditLog.create({
      action,
      performedBy: performedBy || 'admin',
      details: details || {},
      ipAddress: String(ip).split(',')[0].trim(),
      timestamp: now
    });
  } catch (err) {
    console.warn('[Audit & Sync Error]', err.message);
  }
}

module.exports = {
  setCorsHeaders,
  requireAdminAuth,
  recordAuditAndSync
};

