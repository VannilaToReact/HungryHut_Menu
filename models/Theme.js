const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
  {
    themeKey: {
      type: String,
      default: 'active_theme',
      unique: true,
      index: true
    },
    headerColor: {
      type: String,
      default: '#800000'
    },
    headerGrad: {
      type: String,
      default: '#b30000'
    },
    headerBorder: {
      type: String,
      default: '#FFD700'
    },
    bgColor: {
      type: String,
      default: '#fff8f0'
    },
    cardBg: {
      type: String,
      default: '#fdfcf9'
    },
    textColor: {
      type: String,
      default: '#222222'
    },
    accentColor: {
      type: String,
      default: '#8B0000'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Theme', themeSchema);
