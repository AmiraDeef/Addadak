'use strict';

// ─── Load ENV first — MUST be before any other require ────────────────
require('dotenv').config();

// ─── Validate ENV ───────────────────────────────────────────────────
const config = require('./src/config/env');


const app = require('./app');
const connectDB = require('./src/config/database');
const { redisClient } = require('./src/config/redis');
const { verifyMailTransporter } = require('./src/config/mail');

// ─── Workers & Jobs ────────────────────────────────────────────────
const { initEmailWorker } = require('./src/workers/email.worker');
const { scheduleCleanupJob } = require('./src/modules/email/email.queue');

const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();

    // 2. Connect to Redis (Docker local)
    if (redisClient.status === 'wait') {
      await redisClient.connect();
    }

    // 3. Verify Gmail SMTP
    await verifyMailTransporter();

    // 4. Start Workers (Phase 5)
    initEmailWorker();
    await scheduleCleanupJob();

    // 5. Start Express Server
    app.listen(config.port, () => {
      console.log('─────────────────────────────────────────');
      console.log(`[Server] ✅ Notification Server running`);
      console.log(`[Server] 🌐 http://localhost:${config.port}`);
      console.log(`[Server] 🔧 ENV: ${config.env}`);
      console.log('─────────────────────────────────────────');
    });

  } catch (err) {
    console.error('[Server] ❌ Startup failed:', err.message);
    process.exit(1);
  }
};

startServer();
