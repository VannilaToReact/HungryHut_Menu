const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { verifyAdminToken } = require('../middleware/auth');
const { DEFAULT_MENU_DATA } = require('../seed/seedData');

// GET all menu items (Public)
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({}).sort({ page: 1, sortOrder: 1, createdAt: 1 });
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching menu' });
  }
});

// POST add new dish (Admin Protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const {
      name,
      teluguName,
      category,
      price,
      discountPercent,
      type,
      image,
      description,
      page
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, Category, and Price are required.'
      });
    }

    const uniqueId = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const parsedPage = Number(page) || (category.toLowerCase().includes('starter') || category.toLowerCase().includes('curry') ? 2 : 1);

    const newItem = await MenuItem.create({
      id: uniqueId,
      name: name.trim(),
      teluguName: (teluguName || '').trim(),
      category: category.trim(),
      price: Number(price),
      discountPercent: Math.max(0, Math.min(100, Number(discountPercent) || 0)),
      type: type || 'veg',
      image: image || 'images/kaju-biryani.jpg',
      description: (description || '').trim(),
      page: parsedPage,
      isAvailable: true
    });

    // Real-Time Socket.IO Broadcast to all connected devices
    const io = req.app.get('io');
    if (io) {
      io.emit('menu:item_added', newItem);
    }

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: newItem
    });
  } catch (error) {
    console.error('Error adding dish:', error);
    res.status(500).json({ success: false, message: 'Server error while adding product' });
  }
});

// PUT update dish (Admin Protected)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      teluguName,
      category,
      price,
      discountPercent,
      type,
      image,
      description,
      page,
      isAvailable
    } = req.body;

    const item = await MenuItem.findOne({ id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    if (name !== undefined) item.name = name.trim();
    if (teluguName !== undefined) item.teluguName = teluguName.trim();
    if (category !== undefined) item.category = category.trim();
    if (price !== undefined) item.price = Number(price);
    if (discountPercent !== undefined) {
      item.discountPercent = Math.max(0, Math.min(100, Number(discountPercent) || 0));
    }
    if (type !== undefined) item.type = type;
    if (image !== undefined) item.image = image;
    if (description !== undefined) item.description = description.trim();
    if (page !== undefined) item.page = Number(page);
    if (isAvailable !== undefined) item.isAvailable = Boolean(isAvailable);

    await item.save();

    // Real-Time Socket.IO Broadcast to all connected devices
    const io = req.app.get('io');
    if (io) {
      io.emit('menu:item_updated', item);
    }

    res.json({
      success: true,
      message: 'Dish updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Error updating dish:', error);
    res.status(500).json({ success: false, message: 'Server error while updating product' });
  }
});

// PATCH quick price/discount update (Admin Protected)
router.patch('/:id/price', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { price, discountPercent } = req.body;

    const item = await MenuItem.findOne({ id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    if (price !== undefined) item.price = Number(price);
    if (discountPercent !== undefined) {
      item.discountPercent = Math.max(0, Math.min(100, Number(discountPercent) || 0));
    }

    await item.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('menu:item_updated', item);
    }

    res.json({
      success: true,
      message: 'Price updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ success: false, message: 'Server error while updating price' });
  }
});

// DELETE remove dish (Admin Protected)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findOneAndDelete({ id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    // Real-Time Socket.IO Broadcast
    const io = req.app.get('io');
    if (io) {
      io.emit('menu:item_deleted', { id, name: item.name });
    }

    res.json({
      success: true,
      message: `Dish "${item.name}" removed successfully`,
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting dish:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting product' });
  }
});

// POST bulk discount (Admin Protected)
router.post('/discount', verifyAdminToken, async (req, res) => {
  try {
    const { percent, scope } = req.body;
    const discountVal = Math.max(0, Math.min(100, Number(percent) || 0));

    let filter = {};
    if (scope === 'biryani') {
      filter = { category: { $regex: /biryani/i } };
    } else if (scope === 'veg') {
      filter = { type: 'veg' };
    } else if (scope === 'non-veg') {
      filter = { type: 'non-veg' };
    }

    await MenuItem.updateMany(filter, { $set: { discountPercent: discountVal } });
    const allItems = await MenuItem.find({}).sort({ page: 1, sortOrder: 1, createdAt: 1 });

    const io = req.app.get('io');
    if (io) {
      io.emit('menu:batch_updated', allItems);
    }

    res.json({
      success: true,
      message: `Applied ${discountVal}% discount to ${scope} items`,
      data: allItems
    });
  } catch (error) {
    console.error('Error applying discount:', error);
    res.status(500).json({ success: false, message: 'Server error while applying discounts' });
  }
});

// POST reset menu back to default 40 dishes (Admin Protected)
router.post('/reset', verifyAdminToken, async (req, res) => {
  try {
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(DEFAULT_MENU_DATA);
    const allItems = await MenuItem.find({}).sort({ page: 1, sortOrder: 1 });

    const io = req.app.get('io');
    if (io) {
      io.emit('menu:batch_updated', allItems);
    }

    res.json({
      success: true,
      message: 'Reset menu back to default 40 authentic dishes',
      data: allItems
    });
  } catch (error) {
    console.error('Error resetting menu:', error);
    res.status(500).json({ success: false, message: 'Server error while resetting menu' });
  }
});

module.exports = router;
