'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const AppError = require('../shared/helpers/AppError');

/**
 * JWT Authentication Middleware — for Public APIs.
 * Verifies JWT issued by the Auth Server.
 * Reads token from: Authorization: Bearer <token>  OR  Authdata httpOnly cookie.
 * Attaches decoded payload { id, phone } to req.user.
 */
const authMiddleware = (req, res, next) => {
  try {
    let token;

    // 1. Try Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback to httpOnly cookie (set by AuthServer on login)
    if (!token && req.cookies?.Authdata) {
      token = req.cookies.Authdata;
    }

    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    // 3. Verify JWT using same SECRET_KEY as Auth Server
    const decoded = jwt.verify(token, config.security.secretKey);

    // 4. Attach user info to request
    req.user = { id: decoded.id, phone: decoded.phone };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please log in again.', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    next(err);
  }
};

module.exports = authMiddleware;
