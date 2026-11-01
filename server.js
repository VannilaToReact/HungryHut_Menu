require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const { seedDatabase } = require('./seed/seedData');

// Route Handlers
const menuRoutes = require('./routes/menuRoutes');
const themeRoutes = require('./routes/themeRoutes');
const footerRoutes = require('./routes/footerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

// Attach io instance to express app so routes can access req.app.get('io')
app.set('io', io);

// Security Middleware: Helmet with customized CSP to allow Google Fonts, images, inline styles
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
        connectSrc: ["'self'", "ws:", "wss:", "*"]
      }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Strict security: Block any direct browser requests to .env or .git files
app.use((req, res, next) => {
  const normalized = req.path.toLowerCase();
  if (normalized.includes('.env') || normalized.includes('.git') || normalized.includes('node_modules')) {
    return res.status(403).json({ success: false, message: 'Forbidden file access' });
  }
  next();
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to live sync: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });

  // Client can request a manual fresh broadcast if needed
  socket.on('request:sync', () => {
    socket.emit('sync:ack', { timestamp: new Date() });
  });
});

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static assets
app.use(express.static(path.join(__dirname)));

// Single Page Application fallback for index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Server Initialization
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();

    // 2. Automatically seed database if empty (preserves all existing data)
    await seedDatabase();

    // 3. Start HTTP + WebSocket Server
    server.listen(PORT, () => {
      console.log(`🚀 HungryHut Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📡 Real-Time Socket.IO synchronization active`);
      console.log(`🌐 Local menu URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start HungryHut server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = { app, server };
