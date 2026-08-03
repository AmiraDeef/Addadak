'use strict';

const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(config.db.url, { dbName: 'Addadak_DB' });
    console.log('[DB] ✅ MongoDB connected — Addadak_DB');
  } catch (err) {
    console.error('[DB] ❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('disconnected', () => {
  console.warn('[DB] ⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('[DB] ❌ MongoDB error:', err.message);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('[DB] MongoDB connection closed on app termination');
  process.exit(0);
});

module.exports = connectDB;
