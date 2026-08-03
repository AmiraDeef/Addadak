'use strict';

const Redis = require('ioredis');
const config = require('./env');

const redisOptions = {
  host: config.redis.host,
  port: config.redis.port,
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,    // Required by BullMQ
  lazyConnect: true,
};

// Only set password if provided
if (config.redis.password) {
  redisOptions.password = config.redis.password;
}

// Only enable TLS if configured (for Redis Cloud)
if (config.redis.tls) {
  redisOptions.tls = {};
}

const redisClient = new Redis(redisOptions);

redisClient.on('connect', () => {
  console.log('[Redis] ✅ Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('[Redis] ❌ Redis error:', err.message);
});

redisClient.on('close', () => {
  console.warn('[Redis] ⚠️  Redis connection closed');
});

module.exports = { redisClient, redisOptions };
