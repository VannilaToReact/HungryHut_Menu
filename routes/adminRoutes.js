const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const Admin = require('../models/Admin');
const { verifyAdminToken } = require('../middleware/auth');

// Rate limiter for admin login: max 10 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// POST /api/admin/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const jwtSecret = process.env.JWT_SECRET || 'hungryhut_default_secret_key_change_in_prod';
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
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
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// GET /api/admin/me (Protected)
router.get('/me', verifyAdminToken, async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Fetch admin profile error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
});

// POST /api/admin/change-password (Protected)
router.post('/change-password', verifyAdminToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    // Need full document including password hash for comparison
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password entered is incorrect.'
      });
    }

    admin.password = newPassword; // Will be hashed by pre-save hook in Admin model
    await admin.save();

    res.json({
      success: true,
      message: 'Admin password changed successfully!'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating password' });
  }
});

// POST /api/admin/change-email (Protected)
router.post('/change-email', verifyAdminToken, async (req, res) => {
  try {
    const { currentPassword, newEmail } = req.body;

    if (!currentPassword || !newEmail) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new email address are required.'
      });
    }

    const cleanNewEmail = newEmail.toLowerCase().trim();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(cleanNewEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password entered is incorrect.'
      });
    }

    // Check if new email already exists on a different admin
    const emailTaken = await Admin.findOne({ email: cleanNewEmail, _id: { $ne: admin._id } });
    if (emailTaken) {
      return res.status(400).json({
        success: false,
        message: 'This email address is already registered.'
      });
    }

    admin.email = cleanNewEmail;
    await admin.save();

    // Generate fresh JWT token with updated email
    const jwtSecret = process.env.JWT_SECRET || 'hungryhut_default_secret_key_change_in_prod';
    const newToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin email updated successfully!',
      token: newToken,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Change email error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating email' });
  }
});

// POST /api/admin/update-credentials (Protected: updates email and/or password with current password verification)
router.post('/update-credentials', verifyAdminToken, async (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword, confirmPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required to verify your identity.'
      });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password. Verification failed.'
      });
    }

    let emailChanged = false;
    let passwordChanged = false;

    // Handle Email Change
    if (newEmail && newEmail.toLowerCase().trim() !== admin.email) {
      const cleanNewEmail = newEmail.toLowerCase().trim();
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(cleanNewEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email format.'
        });
      }

      const emailTaken = await Admin.findOne({ email: cleanNewEmail, _id: { $ne: admin._id } });
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another admin account.'
        });
      }

      admin.email = cleanNewEmail;
      emailChanged = true;
    }

    // Handle Password Change
    if (newPassword) {
      if (confirmPassword && newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password and confirmation password do not match.'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long.'
        });
      }

      admin.password = newPassword;
      passwordChanged = true;
    }

    if (!emailChanged && !passwordChanged) {
      return res.status(400).json({
        success: false,
        message: 'No changes provided. Please enter a new email or new password.'
      });
    }

    await admin.save();

    // Generate fresh JWT token
    const jwtSecret = process.env.JWT_SECRET || 'hungryhut_default_secret_key_change_in_prod';
    const newToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    let msg = 'Account settings updated: ';
    if (emailChanged && passwordChanged) msg += 'Email and password updated successfully.';
    else if (emailChanged) msg += 'Admin email updated successfully.';
    else if (passwordChanged) msg += 'Admin password updated successfully.';

    res.json({
      success: true,
      message: msg,
      token: newToken,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Update credentials error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating credentials' });
  }
});

module.exports = router;
