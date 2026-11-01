const connectToDatabase = require('../../lib/mongodb');
const { setCorsHeaders } = require('../../lib/middleware');
const Setting = require('../../models/Setting');
const MenuItem = require('../../models/MenuItem');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return;

  try {
    await connectToDatabase();
    const clientTimestamp = req.query.since || req.query.v;
    const syncSetting = await Setting.findOne({ key: 'sync_state' });

    const lastUpdated = syncSetting?.value?.lastUpdated || new Date(0);
    const version = syncSetting?.value?.version || 1;
    const count = await MenuItem.countDocuments();

    // If client supplied timestamp and it matches or is newer, return changed: false
    if (clientTimestamp) {
      const clientDate = new Date(clientTimestamp);
      if (!isNaN(clientDate.getTime()) && clientDate >= new Date(lastUpdated)) {
        return res.status(200).json({
          success: true,
          changed: false,
          version,
          lastUpdated
        });
      }
    }

    res.status(200).json({
      success: true,
      changed: true,
      version,
      lastUpdated,
      count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sync check failed' });
  }
};

