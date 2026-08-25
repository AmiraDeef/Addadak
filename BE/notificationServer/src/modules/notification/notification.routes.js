'use strict';

const express = require('express');
const router = express.Router();

// Middlewares
const internalApiKeyMiddleware = require('../../middlewares/internalApiKey.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');

// Controllers
const controller = require('./notification.controller');

// Validators
const {
  createNotificationSchema,
  processAutoPaySchema,
  notifyByAddressSchema,
  getNotificationsSchema,
  notificationIdSchema,
} = require('./notification.validation');


// ── Internal APIs (Secured by API Key) ──
// Used by Metrics Server to queue notifications

router.post(
  '/',
  internalApiKeyMiddleware,
  validate(createNotificationSchema, 'body'),
  controller.createNotification
);

router.post(
  '/autopay',
  internalApiKeyMiddleware,
  validate(processAutoPaySchema, 'body'),
  controller.processAutoPay
);

router.post(
  '/address',
  internalApiKeyMiddleware,
  validate(notifyByAddressSchema, 'body'),
  controller.notifyByAddress
);

router.post(
  '/by-address',
  internalApiKeyMiddleware,
  validate(notifyByAddressSchema, 'body'),
  controller.notifyByAddress
);

router.post(
  '/:id/retry',
  internalApiKeyMiddleware,
  validate(notificationIdSchema, 'params'),
  controller.retryNotification
);



//  Public APIs (Secured by JWT) 
// Used by the Frontend Client (Users)

router.get(
  '/me',
  authMiddleware,
  validate(getNotificationsSchema, 'query'),
  controller.getMyNotifications
);

router.get(
  '/me/unread-count',
  authMiddleware,
  controller.getUnreadCount
);

router.patch(
  '/me/read-all',
  authMiddleware,
  controller.markAllAsRead
);

router.get(
  '/stats',
  authMiddleware,
  controller.getNotificationStats
);

//  Routes with :id 

router.get(
  '/:id',
  authMiddleware,
  validate(notificationIdSchema, 'params'),
  controller.getNotificationById
);

router.patch(
  '/:id/read',
  authMiddleware,
  validate(notificationIdSchema, 'params'),
  controller.markAsRead
);

router.delete(
  '/:id',
  authMiddleware,
  validate(notificationIdSchema, 'params'),
  controller.deleteNotification
);

module.exports = router;
