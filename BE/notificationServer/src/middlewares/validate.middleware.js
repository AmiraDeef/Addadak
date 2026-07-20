'use strict';

const AppError = require('../shared/helpers/AppError');

/**
 * Joi Validation Middleware Factory.
 * @param {Object} schema - Joi schema to validate against
 * @param {'body'|'params'|'query'} source - Which part of the request to validate
 * @returns Express middleware function
 *
 * Usage:
 *   router.post('/', validate(createNotificationSchema), controller)
 *   router.get('/:id', validate(notificationIdSchema, 'params'), controller)
 *   router.get('/', validate(paginationSchema, 'query'), controller)
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,    // Collect ALL validation errors, not just the first
      stripUnknown: true,   // Remove extra fields not in schema
    });

    if (error) {
      // Format all validation messages into a clean array
      const messages = error.details.map((d) => d.message.replace(/"/g, "'"));
      return next(new AppError(`Validation failed: ${messages.join(', ')}`, 400));
    }

    // Replace req[source] with the sanitized/validated value
    req[source] = value;
    next();
  };
};

module.exports = validate;
