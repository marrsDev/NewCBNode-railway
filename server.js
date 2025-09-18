// server.js - Railway optimized
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const cartSession = require('./middleware/cartSession');
const logger = require('./utils/logger');

// Enhanced error handling
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', error);
  setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', reason);
  setTimeout(() => process.exit(1), 1000);
});

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(cartSession);
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection with Railway optimization
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/windowcalculator';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
  bufferCommands: false,
  bufferMaxEntries: 0
};

if (MONGODB_URI.includes('mongodb+srv://')) {
  mongooseOptions.ssl = true;
  mongooseOptions.sslValidate = false;
}

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    logger.info('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    logger.error('❌ MongoDB connection error:', err);
    // Don't exit - allow server to start without DB for static files
  });

// MongoDB connection events
mongoose.connection.on('error', (err) => {
  logger.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB disconnected');
});

// Import routes
const calculationRoutes = require('./routes/api/calculationRoutes');
const cartRoutes = require('./routes/api/cartRoutes');
const pricingRoutes = require('./routes/api/pricingRoutes');
const previewRoutes = require('./routes/api/previewRoutes');

// Mount API routes
app.use('/api/calculations', calculationRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/preview', previewRoutes);

// Health check endpoint (required for Railway)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Server is running',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message 
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'API endpoint not found' 
  });
});

// Get port from Railway or use default
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🗄️ Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  logger.info(`🌐 Access: http://localhost:${PORT}`);
});

module.exports = app;
