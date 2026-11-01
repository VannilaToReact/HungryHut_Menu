const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema(
  {
    footerKey: {
      type: String,
      default: 'active_footer',
      unique: true,
      index: true
    },
    restaurantTitle: {
      type: String,
      default: 'Hungry Hut Restaurant & Cafe'
    },
    tagline: {
      type: String,
      default: 'Authentic Dum Biryanis, Starters, Wok Rice & Curries'
    },
    address: {
      type: String,
      default: 'Near K. R. R. School, Kurnool to Nandyal Road, PANYAM, 518112'
    },
    phoneNumbers: {
      type: String,
      default: '85559 38190, 63044 54153'
    },
    timings: {
      type: String,
      default: 'Open Daily: 11:00 AM - 11:00 PM'
    },
    services: {
      type: String,
      default: 'Dine-In • Takeaway • Bulk Party Orders'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Footer', footerSchema);
