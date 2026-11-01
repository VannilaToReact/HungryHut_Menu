const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');
const { verifyAdminToken } = require('../middleware/auth');
const { DEFAULT_THEME_DATA } = require('../seed/seedData');

// GET active theme (Public)
router.get('/', async (req, res) => {
  try {
    let theme = await Theme.findOne({ themeKey: 'active_theme' });
    if (!theme) {
      theme = await Theme.create(DEFAULT_THEME_DATA);
    }
    res.json({ success: true, data: theme });
  } catch (error) {
    console.error('Error fetching theme:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching theme' });
  }
});

// POST update theme (Admin Protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { headerColor, headerGrad, headerBorder, bgColor, cardBg, textColor, accentColor } = req.body;

    const theme = await Theme.findOneAndUpdate(
      { themeKey: 'active_theme' },
      {
        $set: {
          headerColor: headerColor || '#800000',
          headerGrad: headerGrad || '#b30000',
          headerBorder: headerBorder || '#FFD700',
          bgColor: bgColor || '#fff8f0',
          cardBg: cardBg || '#fdfcf9',
          textColor: textColor || '#222222',
          accentColor: accentColor || '#8B0000'
        }
      },
      { new: true, upsert: true }
    );

    // Real-Time Socket.IO Broadcast
    const io = req.app.get('io');
    if (io) {
      io.emit('theme:updated', theme);
    }

    res.json({ success: true, message: 'Theme updated successfully', data: theme });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({ success: false, message: 'Server error while updating theme' });
  }
});

// POST reset theme to default red (Admin Protected)
router.post('/reset', verifyAdminToken, async (req, res) => {
  try {
    const theme = await Theme.findOneAndUpdate(
      { themeKey: 'active_theme' },
      { $set: DEFAULT_THEME_DATA },
      { new: true, upsert: true }
    );

    const io = req.app.get('io');
    if (io) {
      io.emit('theme:updated', theme);
    }

    res.json({ success: true, message: 'Theme reset to default', data: theme });
  } catch (error) {
    console.error('Error resetting theme:', error);
    res.status(500).json({ success: false, message: 'Server error while resetting theme' });
  }
});

module.exports = router;
