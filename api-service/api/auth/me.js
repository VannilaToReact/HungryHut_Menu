const connectToDatabase = require('../../lib/mongodb');
const { setCorsHeaders, requireAdminAuth } = require('../../lib/middleware');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return;

  try {
    await connectToDatabase();
    const adminUser = await requireAdminAuth(req, res);
    if (!adminUser) return;

    res.status(200).json({
      success: true,
      admin: {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        lastLogin: adminUser.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

