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

    const { value, error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(error);
    }

    switch (source) {
      case 'body':
        req.body = value;
        break;

      case 'params':
        req.params = value;
        break;

      case 'query':
        req.validatedQuery = value;
        break;
    }

    next();
  };
};
module.exports = validate;
