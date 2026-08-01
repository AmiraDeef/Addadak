'use strict';

const { Queue } = require('bullmq');
const { redisOptions } = require('./redis');
const config = require('./env');

// Default job options applied to every job added to the queue
const defaultJobOptions = {
  attempts: config.bull.maxAttempts,
  backoff: {
    type: 'exponential',
    delay: config.bull.backoffDelay,
  },
  removeOnComplete: { age: 86400 },  // Keep completed jobs for 24 hours
  removeOnFail: { age: 604800 },     // Keep failed jobs for 7 days
};

// Create the main email queue — BullMQ uses the Redis connection
const emailQueue = new Queue('email-queue', {
  connection: redisOptions,
  defaultJobOptions,
});

emailQueue.on('error', (err) => {
  console.error('[BullMQ] ❌ Queue error:', err.message);
});

console.log('[BullMQ] ✅ email-queue initialized');

module.exports = { emailQueue, defaultJobOptions };
