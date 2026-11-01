const connectToDatabase = require('../../lib/mongodb');
const { setCorsHeaders, requireAdminAuth, recordAuditAndSync } = require('../../lib/middleware');
const MenuItem = require('../../models/MenuItem');
const Setting = require('../../models/Setting');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return;

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const items = await MenuItem.find({}).sort({ page: 1, sortOrder: 1, createdAt: 1 });
      const syncSetting = await Setting.findOne({ key: 'sync_state' });

      return res.status(200).json({
        success: true,
        count: items.length,
        version: syncSetting?.value?.version || 1,
        lastUpdated: syncSetting?.value?.lastUpdated || new Date(),
        data: items
      });
    }

    if (req.method === 'POST') {
      const adminUser = await requireAdminAuth(req, res);
      if (!adminUser) return;

      const { name, teluguName, category, price, discountPercent, type, image, description, page } = req.body || {};

      if (!name || !category || price === undefined) {
        return res.status(400).json({ success: false, message: 'Name, Category, and Price are required.' });
      }

      const uniqueId = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const parsedPage = Number(page) || (category.toLowerCase().includes('starter') || category.toLowerCase().includes('curry') ? 2 : 1);

      const newItem = await MenuItem.create({
        id: uniqueId,
        name: String(name).trim(),
        teluguName: String(teluguName || '').trim(),
        category: String(category).trim(),
        price: Number(price),
        discountPercent: Math.max(0, Math.min(100, Number(discountPercent) || 0)),
        type: type || 'veg',
        image: image || 'images/kaju-biryani.jpg',
        description: String(description || '').trim(),
        page: parsedPage,
        isAvailable: true
      });

      await recordAuditAndSync('ITEM_ADD', { id: newItem.id, name: newItem.name }, adminUser.email, req);

      return res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: newItem
      });
    }

    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Menu Error:', error);
    res.status(500).json({ success: false, message: 'Server error processing menu' });
  }
};

