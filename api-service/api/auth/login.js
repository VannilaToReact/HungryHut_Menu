const connectToDatabase = require('../../lib/mongodb');
const { setCorsHeaders, recordAuditAndSync } = require('../../lib/middleware');
const { signToken } = require('../../lib/auth');
const Admin = require('../../models/Admin');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = signToken({ id: admin._id, email: admin.email, role: admin.role }, '24h');
    await recordAuditAndSync('ADMIN_LOGIN', { email: admin.email }, admin.email, req);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Serverless Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

