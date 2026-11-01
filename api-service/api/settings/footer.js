const connectToDatabase = require('../../lib/mongodb');
const { setCorsHeaders, requireAdminAuth, recordAuditAndSync } = require('../../lib/middleware');
const Setting = require('../../models/Setting');
const { DEFAULT_FOOTER_DATA } = require('../../seed/seedData');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return;

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const setting = await Setting.findOne({ key: 'footer' });
      return res.status(200).json({ success: true, data: setting ? setting.value : DEFAULT_FOOTER_DATA });
    }

    if (req.method === 'POST') {
      const adminUser = await requireAdminAuth(req, res);
      if (!adminUser) return;

      const footerData = req.body || {};
      const setting = await Setting.findOneAndUpdate(
        { key: 'footer' },
        { value: footerData },
        { upsert: true, new: true }
      );

      await recordAuditAndSync('FOOTER_UPDATE', footerData, adminUser.email, req);
      return res.status(200).json({ success: true, message: 'Footer updated successfully', data: setting.value });
    }

    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Footer endpoint error' });
  }
};

