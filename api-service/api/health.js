const connectToDatabase = require('../lib/mongodb');
const { setCorsHeaders } = require('../lib/middleware');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return;

  try {
    await connectToDatabase();
    res.status(200).json({
      success: true,
      api: 'online',
      mode: 'Vercel Serverless Function',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      api: 'online',
      database: 'disconnected',
      error: error.message
    });
  }
};

