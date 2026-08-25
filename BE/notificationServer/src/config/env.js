'use strict';

// NOTE: dotenv is loaded in server.js BEFORE this file is required.

const REQUIRED_ENV = [
  'PORT',
  'DB_URL',
  'REDIS_HOST',
  'REDIS_PORT',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASS',
  'MAIL_FROM',
  'SECRET_KEY',
  'INTERNAL_API_KEY',
];

REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`[ENV ERROR] Missing required environment variable: ${key}`);
  }
});

const config = Object.freeze({
  env: process.env.NODE_ENV || 'dev',
  port: Number(process.env.PORT) || 3003,

  db: {
    url: process.env.DB_URL,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_TLS === 'true',
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
  },

  security: {
    secretKey: process.env.SECRET_KEY,
    internalApiKey: process.env.INTERNAL_API_KEY,
  },

  bull: {
    maxAttempts: Number(process.env.BULL_MAX_ATTEMPTS) || 3,
    backoffDelay: Number(process.env.BULL_BACKOFF_DELAY) || 5000,
    cleanupCron: process.env.BULL_CLEANUP_CRON || '0 */6 * * *',
  },

  wallet: {
    url: process.env.WALLET_URL || 'http://localhost:3002',
  },
});

module.exports = config;
