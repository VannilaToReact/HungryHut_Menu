const connectToDatabase = require('../../lib/mongodb');
const { setCorsHeaders, requireAdminAuth, recordAuditAndSync } = require('../../lib/middleware');
const Setting = require('../../models/Setting');
const { DEFAULT_THEME_DATA } = require('../../seed/seedData');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return;

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const setting = await Setting.findOne({ key: 'theme' });
      return res.status(200).json({ success: true, data: setting ? setting.value : DEFAULT_THEME_DATA });
    }

    if (req.method === 'POST') {
      const adminUser = await requireAdminAuth(req, res);
      if (!adminUser) return;

      const themeData = req.body || {};
      const setting = await Setting.findOneAndUpdate(
        { key: 'theme' },
        { value: themeData },
        { upsert: true, new: true }
      );

      await recordAuditAndSync('THEME_UPDATE', themeData, adminUser.email, req);
      return res.status(200).json({ success: true, message: 'Theme updated successfully', data: setting.value });
    }

    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Theme endpoint error' });
  }
};

