'use strict';

const AppError = require('../shared/helpers/AppError');
const config = require('../config/env');

/**
 * Global Express Error Handler Middleware.
 * Handles: AppError, Mongoose errors, Joi errors, and unexpected errors.
 */
const errorMiddleware = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let status = err.status || 'error';
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  // Mongoose: Invalid ObjectId (e.g. /api/notifications/not-an-id)
  if (err.name === 'CastError') {
    statusCode = 400;
    status = 'fail';
    message = `Invalid ${err.path}: '${err.value}' is not a valid ID.`;
  }

  // Mongoose: Duplicate key (unique constraint violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    status = 'fail';
    message = `Duplicate value for field '${field}'. Please use a different value.`;
  }

  // Mongoose: Validation errors (required fields missing, enum mismatch, etc.)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    status = 'fail';
    const messages = Object.values(err.errors).map((e) => e.message);
    message = `Validation failed: ${messages.join(', ')}`;
  }

  // JWT errors (handled in auth middleware, but just in case)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    status = 'fail';
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    status = 'fail';
    message = 'Your session has expired. Please log in again.';
  }

  
  if (statusCode >= 500) {
    console.error(`[Error] ${statusCode} — ${message}`);
    if (config.env === 'dev') console.error(err.stack);
  }

  // Send response
  const response = { status, message };

  // In dev mode: include stack trace for easier debugging
  if (config.env === 'dev' && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
