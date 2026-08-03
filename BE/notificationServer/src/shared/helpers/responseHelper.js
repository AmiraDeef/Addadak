'use strict';

/**
 * Standardized API response format helpers
 */

const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    data,
  });
};

const error = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
    message,
  });
};

module.exports = {
  success,
  error,
};
