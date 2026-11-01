const connectToDatabase = require('../../lib/mongodb');
const { setCorsHeaders, requireAdminAuth, recordAuditAndSync } = require('../../lib/middleware');
const { isValidPassword } = require('../../lib/validation');
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

    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirmation do not match' });
    }

    const admin = await Admin.findById(adminUser._id);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password. Verification failed.' });
    }

    admin.password = newPassword; // hashed automatically by pre-save hook
    await admin.save();

    await recordAuditAndSync('PASSWORD_CHANGE', {}, admin.email, req);

    res.status(200).json({
      success: true,
      message: 'Admin password changed successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating password' });
  }
};

