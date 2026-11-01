const connectToDatabase = require('../../lib/mongodb');
const { setCorsHeaders } = require('../../lib/middleware');
const Category = require('../../models/Category');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return;

  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ page: 1, sortOrder: 1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
};

