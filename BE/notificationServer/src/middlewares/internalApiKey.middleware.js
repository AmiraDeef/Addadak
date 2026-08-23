'use strict';

const config = require('../config/env');
const AppError = require('../shared/helpers/AppError');

/**
 * Internal API Key Middleware — for Internal APIs (service-to-service).
 * Used to authenticate requests from Metrics Server to Notification Server.
 * Reads key from: x-internal-api-key header.
 * Uses constant-time comparison to prevent timing attacks.
 */
const internalApiKeyMiddleware = (req, res, next) => {
  const providedKey = req.headers['x-internal-api-key'];

  if (!providedKey) {
    return next(new AppError('Missing internal API key.', 403));
  }

  // Constant-time comparison to prevent timing attacks
  const expectedKey = config.security.internalApiKey;

  if (providedKey.length !== expectedKey.length) {
    return next(new AppError('Invalid internal API key.', 403));
  }

  let mismatch = 0;
  for (let i = 0; i < expectedKey.length; i++) {
    // XOR comparison — doesn't short-circuit
    mismatch |= providedKey.charCodeAt(i) ^ expectedKey.charCodeAt(i);
  }

  if (mismatch !== 0) {
    return next(new AppError('Invalid internal API key.', 403));
  }

  next();
};

module.exports = internalApiKeyMiddleware;
