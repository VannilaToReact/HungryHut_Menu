const connectToDatabase = require('../../lib/mongodb');
const { setCorsHeaders, requireAdminAuth, recordAuditAndSync } = require('../../lib/middleware');
const { isValidEmail } = require('../../lib/validation');
const { signToken } = require('../../lib/auth');
const Admin = require('../../models/Admin');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();
    const adminUser = await requireAdminAuth(req, res);
    if (!adminUser) return;

    const { currentPassword, newEmail } = req.body || {};

    if (!currentPassword || !newEmail) {
      return res.status(400).json({ success: false, message: 'Current password and new email are required' });
    }

    const cleanEmail = String(newEmail).toLowerCase().trim();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email address format' });
    }

    const admin = await Admin.findById(adminUser._id);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password. Verification failed.' });
    }

    const exists = await Admin.findOne({ email: cleanEmail, _id: { $ne: admin._id } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'This email is already in use by another admin' });
    }

    const oldEmail = admin.email;
    admin.email = cleanEmail;
    await admin.save();

    const token = signToken({ id: admin._id, email: admin.email, role: admin.role }, '24h');
    await recordAuditAndSync('EMAIL_CHANGE', { oldEmail, newEmail: cleanEmail }, admin.email, req);

    res.status(200).json({
      success: true,
      message: 'Admin email updated successfully!',
      token,
      admin: { id: admin._id, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating email' });
  }
};

