require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const connectToDatabase = require('../lib/db');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Admin = require('../models/Admin');
const Setting = require('../models/Setting');
const AuditLog = require('../models/AuditLog');
const { verifyAdminToken } = require('../middleware/auth');
const { DEFAULT_MENU_DATA, DEFAULT_THEME_DATA, DEFAULT_FOOTER_DATA, seedServerlessDatabase } = require('../seed/seedData');

const app = express();

// Helper to update sync timestamp and increment version
async function bumpSyncState(actionName, details, performedBy = 'admin', req = null) {
  try {
    const now = new Date();
    await Setting.findOneAndUpdate(
      { key: 'sync_state' },
      {
        $inc: { 'value.version': 1 },
        $set: { 'value.lastUpdated': now }
      },
      { upsert: true, new: true }
    );

    // Record audit log
    const ip = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') : '';
    await AuditLog.create({
      action: actionName,
      performedBy: performedBy || 'admin',
      details: details || {},
      ipAddress: String(ip).split(',')[0].trim(),
      timestamp: now
    });
  } catch (e) {
    console.warn('[Sync Bump Error]', e.message);
  }
}

// Configurable CORS for GitHub Pages and Localhost
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'https://vannilatoreact.github.io,http://localhost:5000,http://localhost:8080,http://localhost:3000')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or matched origins
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.github.io')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive CORS to allow client on GitHub Pages without block
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection middleware for Serverless Invocations
let seeded = false;
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    if (!seeded) {
      await seedServerlessDatabase();
      seeded = true;
    }
    next();
  } catch (err) {
    console.error('Serverless DB Error:', err);
    res.status(500).json({ success: false, message: 'Could not connect to database' });
  }
});

// ----------------------------------------------------------------------------
// 1. HEALTH CHECK & SYNC DETECTION ENDPOINTS
// ----------------------------------------------------------------------------

app.get(['/api/health', '/health'], (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'healthy',
    mode: 'Vercel Serverless Function',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

/**
 * Change Detection API for 10-15s Polling (Requirement F)
 * Avoids unnecessary full-database downloads when data hasn't changed.
 */
app.get(['/api/sync/check', '/sync/check'], async (req, res) => {
  try {
    const clientTimestamp = req.query.since || req.query.v;
    const syncSetting = await Setting.findOne({ key: 'sync_state' });
    const lastUpdated = syncSetting?.value?.lastUpdated || new Date(0);
    const version = syncSetting?.value?.version || 1;
    const count = await MenuItem.countDocuments();

    if (clientTimestamp) {
      const clientDate = new Date(clientTimestamp);
      if (!isNaN(clientDate.getTime()) && clientDate >= new Date(lastUpdated)) {
        return res.json({
          success: true,
          changed: false,
          version,
          lastUpdated
        });
      }
    }

    res.json({
      success: true,
      changed: true,
      version,
      lastUpdated,
      count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sync check error' });
  }
});

// ----------------------------------------------------------------------------
// 2. MENU MANAGEMENT CRUD APIS
// ----------------------------------------------------------------------------

app.get(['/api/menu', '/menu'], async (req, res) => {
  try {
    const items = await MenuItem.find({}).sort({ page: 1, sortOrder: 1, createdAt: 1 });
    const syncSetting = await Setting.findOne({ key: 'sync_state' });

    res.json({
      success: true,
      count: items.length,
      version: syncSetting?.value?.version || 1,
      lastUpdated: syncSetting?.value?.lastUpdated || new Date(),
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching menu items' });
  }
});

app.post(['/api/menu', '/menu'], verifyAdminToken, async (req, res) => {
  try {
    const { name, teluguName, category, price, discountPercent, type, image, description, page } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, Category, and Price are required.' });
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

    await bumpSyncState('ITEM_ADD', { id: newItem.id, name: newItem.name }, req.admin?.email, req);

    res.status(201).json({ success: true, message: 'Dish added successfully', data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating menu item' });
  }
});

app.put(['/api/menu/:id', '/menu/:id'], verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, teluguName, category, price, discountPercent, type, image, description, page, isAvailable } = req.body;

    const item = await MenuItem.findOne({ id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    if (name !== undefined) item.name = name.trim();
    if (teluguName !== undefined) item.teluguName = teluguName.trim();
    if (category !== undefined) item.category = category.trim();
    if (price !== undefined) item.price = Number(price);
    if (discountPercent !== undefined) item.discountPercent = Math.max(0, Math.min(100, Number(discountPercent) || 0));
    if (type !== undefined) item.type = type;
    if (image !== undefined) item.image = image;
    if (description !== undefined) item.description = description.trim();
    if (page !== undefined) item.page = Number(page);
    if (isAvailable !== undefined) item.isAvailable = Boolean(isAvailable);

    await item.save();
    await bumpSyncState('ITEM_UPDATE', { id: item.id, name: item.name }, req.admin?.email, req);

    res.json({ success: true, message: 'Dish updated successfully', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating menu item' });
  }
});

app.patch(['/api/menu/:id/price', '/menu/:id/price'], verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { price, discountPercent } = req.body;

    const item = await MenuItem.findOne({ id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    if (price !== undefined) item.price = Number(price);
    if (discountPercent !== undefined) item.discountPercent = Math.max(0, Math.min(100, Number(discountPercent) || 0));

    await item.save();
    await bumpSyncState('PRICE_CHANGE', { id: item.id, price: item.price, discountPercent: item.discountPercent }, req.admin?.email, req);

    res.json({ success: true, message: 'Price updated successfully', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating price' });
  }
});

app.delete(['/api/menu/:id', '/menu/:id'], verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findOneAndDelete({ id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    await bumpSyncState('ITEM_DELETE', { id, name: item.name }, req.admin?.email, req);
    res.json({ success: true, message: `Dish "${item.name}" deleted successfully`, data: { id } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting menu item' });
  }
});

app.post(['/api/menu/discount', '/menu/discount'], verifyAdminToken, async (req, res) => {
  try {
    const { percent, scope } = req.body;
    const discountVal = Math.max(0, Math.min(100, Number(percent) || 0));

    let filter = {};
    if (scope === 'biryani') filter = { category: { $regex: /biryani/i } };
    else if (scope === 'veg') filter = { type: 'veg' };
    else if (scope === 'non-veg') filter = { type: 'non-veg' };

    await MenuItem.updateMany(filter, { $set: { discountPercent: discountVal } });
    const allItems = await MenuItem.find({}).sort({ page: 1, sortOrder: 1 });

    await bumpSyncState('BULK_DISCOUNT', { percent: discountVal, scope }, req.admin?.email, req);
    res.json({ success: true, message: `Applied ${discountVal}% discount to ${scope} items`, data: allItems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error applying bulk discounts' });
  }
});

app.post(['/api/menu/reset', '/menu/reset'], verifyAdminToken, async (req, res) => {
  try {
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(DEFAULT_MENU_DATA);
    const allItems = await MenuItem.find({}).sort({ page: 1, sortOrder: 1 });

    await bumpSyncState('MENU_RESET', { count: DEFAULT_MENU_DATA.length }, req.admin?.email, req);
    res.json({ success: true, message: 'Reset menu back to default 40 authentic dishes', data: allItems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting menu' });
  }
});

// ----------------------------------------------------------------------------
// 3. CATEGORIES, THEME & FOOTER SETTINGS
// ----------------------------------------------------------------------------

app.get(['/api/categories', '/categories'], async (req, res) => {
  try {
    const cats = await Category.find({ isActive: true }).sort({ page: 1, sortOrder: 1 });
    res.json({ success: true, data: cats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
});

app.get(['/api/theme', '/theme'], async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: 'theme' });
    res.json({ success: true, data: setting ? setting.value : DEFAULT_THEME_DATA });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching theme' });
  }
});

app.post(['/api/theme', '/theme'], verifyAdminToken, async (req, res) => {
  try {
    const themeData = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: 'theme' },
      { value: themeData },
      { upsert: true, new: true }
    );
    await bumpSyncState('THEME_UPDATE', themeData, req.admin?.email, req);
    res.json({ success: true, message: 'Theme updated successfully', data: setting.value });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating theme' });
  }
});

app.post(['/api/theme/reset', '/theme/reset'], verifyAdminToken, async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { key: 'theme' },
      { value: DEFAULT_THEME_DATA },
      { upsert: true, new: true }
    );
    await bumpSyncState('THEME_RESET', DEFAULT_THEME_DATA, req.admin?.email, req);
    res.json({ success: true, message: 'Theme reset to default', data: setting.value });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting theme' });
  }
});

app.get(['/api/footer', '/footer'], async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: 'footer' });
    res.json({ success: true, data: setting ? setting.value : DEFAULT_FOOTER_DATA });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching footer' });
  }
});

app.post(['/api/footer', '/footer'], verifyAdminToken, async (req, res) => {
  try {
    const footerData = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: 'footer' },
      { value: footerData },
      { upsert: true, new: true }
    );
    await bumpSyncState('FOOTER_UPDATE', footerData, req.admin?.email, req);
    res.json({ success: true, message: 'Footer updated successfully', data: setting.value });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating footer' });
  }
});

// ----------------------------------------------------------------------------
// 4. ADMIN AUTHENTICATION, PASSWORD & EMAIL CHANGE
// ----------------------------------------------------------------------------

app.post(['/api/admin/login', '/admin/login'], async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const jwtSecret = process.env.JWT_SECRET || 'hungryhut_default_secret_key_change_in_prod';
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    await bumpSyncState('ADMIN_LOGIN', { email: admin.email }, admin.email, req);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: admin._id, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

app.get(['/api/admin/me', '/admin/me'], verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    admin: { id: req.admin._id, email: req.admin.email, role: req.admin.role }
  });
});

app.post(['/api/admin/update-credentials', '/admin/update-credentials'], verifyAdminToken, async (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword, confirmPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required for verification.' });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password. Verification failed.' });
    }

    let emailChanged = false;
    let passwordChanged = false;

    if (newEmail && newEmail.toLowerCase().trim() !== admin.email) {
      const cleanEmail = newEmail.toLowerCase().trim();
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({ success: false, message: 'Invalid email address format.' });
      }

      const exists = await Admin.findOne({ email: cleanEmail, _id: { $ne: admin._id } });
      if (exists) {
        return res.status(400).json({ success: false, message: 'This email is already registered.' });
      }

      admin.email = cleanEmail;
      emailChanged = true;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      }
      if (confirmPassword && newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'New password and confirmation do not match.' });
      }

      admin.password = newPassword; // hashed automatically by pre-save hook
      passwordChanged = true;
    }

    if (!emailChanged && !passwordChanged) {
      return res.status(400).json({ success: false, message: 'No changes provided.' });
    }

    await admin.save();

    const jwtSecret = process.env.JWT_SECRET || 'hungryhut_default_secret_key_change_in_prod';
    const newToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    await bumpSyncState('CREDENTIALS_CHANGE', { emailChanged, passwordChanged }, admin.email, req);

    res.json({
      success: true,
      message: 'Admin account credentials updated successfully in MongoDB.',
      token: newToken,
      admin: { id: admin._id, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating credentials' });
  }
});

app.get(['/api/audit-logs', '/audit-logs'], verifyAdminToken, async (req, res) => {
  try {
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching audit logs' });
  }
});

module.exports = app;

