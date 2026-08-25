'use strict';

const notificationService = require('./notification.service');
const { success } = require('../../shared/helpers/responseHelper');

class NotificationController {

  // ── Internal APIs (Called by Metrics Server via x-internal-api-key) ──

  async createNotification(req, res, next) {
    try {
      const notification = await notificationService.createAndQueue(req.body);
      return success(res, notification, 201);
    } catch (err) {
      next(err);
    }
  }

  async processAutoPay(req, res, next) {
    try {
      const notification = await notificationService.processAutoPay(req.body);
      return success(res, notification, 201);
    } catch (err) {
      next(err);
    }
  }

  async notifyByAddress(req, res, next) {
    try {
      const result = await notificationService.notifyByAddress(req.body);
      return success(res, result, 201);
    } catch (err) {
      next(err);
    }
  }


  async retryNotification(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await notificationService.retryFailed(id);
      return success(res, notification, 200);
    } catch (err) {
      next(err);
    }
  }

  // ── Public APIs (Called by Frontend, secured by JWT) ───────────────

  async getMyNotifications(req, res, next) {
    try {
      const { page, limit } = req.query;
      const userId = req.user.id; // From auth.middleware.js

      const result = await notificationService.getMyNotifications(userId, page, limit);
      return success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await notificationService.getUnreadCount(userId);
      return success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await notificationService.markAllAsRead(userId);
      return success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  async getNotificationById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await notificationService.getById(id);

      // Ensure user owns this notification
      if (notification.userId.toString() !== userId) {
        return res.status(403).json({ status: 'fail', message: 'Forbidden' });
      }

      return success(res, notification, 200);
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await notificationService.markAsRead(id, userId);
      return success(res, notification, 200);
    } catch (err) {
      next(err);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await notificationService.deleteNotification(id, userId);
      return success(res, null, 204); // 204 No Content
    } catch (err) {
      next(err);
    }
  }

  async getNotificationStats(req, res, next) {
    try {
      // Could restrict to admins if needed, but for now we'll just return general stats
      const stats = await notificationService.getStats();
      return success(res, stats, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
