const connectToDatabase = require('../../lib/mongodb');
const { setCorsHeaders, requireAdminAuth, recordAuditAndSync } = require('../../lib/middleware');
const { isValidEmail, isValidPassword } = require('../../lib/validation');
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

    const { currentPassword, newEmail, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required to verify your identity' });
    }

    const admin = await Admin.findById(adminUser._id);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password. Verification failed.' });
    }

    let emailChanged = false;
    let passwordChanged = false;

    if (newEmail && newEmail.toLowerCase().trim() !== admin.email) {
      const cleanEmail = newEmail.toLowerCase().trim();
      if (!isValidEmail(cleanEmail)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }

      const exists = await Admin.findOne({ email: cleanEmail, _id: { $ne: admin._id } });
      if (exists) {
        return res.status(400).json({ success: false, message: 'This email is already in use' });
      }

      admin.email = cleanEmail;
      emailChanged = true;
    }

    if (newPassword) {
      if (!isValidPassword(newPassword)) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      }
      if (confirmPassword && newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'New password and confirmation do not match' });
      }
      admin.password = newPassword;
      passwordChanged = true;
    }

    if (!emailChanged && !passwordChanged) {
      return res.status(400).json({ success: false, message: 'No changes provided' });
    }

    await admin.save();

    const token = signToken({ id: admin._id, email: admin.email, role: admin.role }, '24h');
    await recordAuditAndSync('CREDENTIALS_UPDATE', { emailChanged, passwordChanged }, admin.email, req);

    res.status(200).json({
      success: true,
      message: 'Admin account credentials updated successfully in MongoDB.',
      token,
      admin: { id: admin._id, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating credentials' });
  }
};

