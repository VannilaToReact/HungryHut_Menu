const express = require('express');
const router = express.Router();
const Footer = require('../models/Footer');
const { verifyAdminToken } = require('../middleware/auth');
const { DEFAULT_FOOTER_DATA } = require('../seed/seedData');

// GET active footer (Public)
router.get('/', async (req, res) => {
  try {
    let footer = await Footer.findOne({ footerKey: 'active_footer' });
    if (!footer) {
      footer = await Footer.create(DEFAULT_FOOTER_DATA);
    }
    res.json({ success: true, data: footer });
  } catch (error) {
    console.error('Error fetching footer:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching footer' });
  }
});

// POST update footer (Admin Protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { restaurantTitle, tagline, address, phoneNumbers, timings, services } = req.body;

    const footer = await Footer.findOneAndUpdate(
      { footerKey: 'active_footer' },
      {
        $set: {
          restaurantTitle: (restaurantTitle || '').trim() || DEFAULT_FOOTER_DATA.restaurantTitle,
          tagline: (tagline || '').trim(),
          address: (address || '').trim() || DEFAULT_FOOTER_DATA.address,
          phoneNumbers: (phoneNumbers || '').trim() || DEFAULT_FOOTER_DATA.phoneNumbers,
          timings: (timings || '').trim() || DEFAULT_FOOTER_DATA.timings,
          services: (services || '').trim() || DEFAULT_FOOTER_DATA.services
        }
      },
      { new: true, upsert: true }
    );

    // Real-Time Socket.IO Broadcast
    const io = req.app.get('io');
    if (io) {
      io.emit('footer:updated', footer);
    }

    res.json({ success: true, message: 'Footer updated successfully', data: footer });
  } catch (error) {
    console.error('Error updating footer:', error);
    res.status(500).json({ success: false, message: 'Server error while updating footer' });
  }
});

module.exports = router;
