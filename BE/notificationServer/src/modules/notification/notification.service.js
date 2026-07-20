'use strict';

const Notification = require('./notification.model');
const { PENDING, QUEUED } = require('../../shared/constants/notificationStatus');
const AppError = require('../../shared/helpers/AppError');
class NotificationService {
  /**
   * Create a notification in DB and add it to BullMQ
   */
  async createAndQueue(data) {
    // 1. Save to MongoDB (Status: PENDING)
    const notification = new Notification({
      ...data,
      status: PENDING,
    });
    await notification.save();

    // 2. Add to BullMQ
    try {
      const emailQueue = require('../email/email.queue'); // Lazy load to avoid circular deps if any
      
      if (notification.scheduledFor) {
        const delayMs = new Date(notification.scheduledFor).getTime() - Date.now();
        await emailQueue.addDelayedEmailJob(notification._id, Math.max(0, delayMs));
      } else {
        await emailQueue.addEmailJob(notification._id);
      }

      // 3. Update status to QUEUED
      notification.status = QUEUED;
      await notification.save();

    } catch (err) {
      console.error('[NotificationService] Failed to queue job:', err.message);
      // Status remains PENDING, can be retried later
    }

    return notification;
  }

  /**
   * Get paginated notifications for a specific user
   */
  async getMyNotifications(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ userId }),
    ]);

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single notification by ID
   */
  async getById(id) {
    const notification = await Notification.findById(id);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    return notification;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new AppError('Notification not found or not owned by user', 404);
    }

    return notification;
  }

  /**
   * Mark all unread notifications as read for a user
   */
  async markAllAsRead(userId) {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId) {
    const count = await Notification.countDocuments({ userId, isRead: false });
    return { unreadCount: count };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id, userId) {
    const notification = await Notification.findOneAndDelete({ _id: id, userId });
    if (!notification) {
      throw new AppError('Notification not found or not owned by user', 404);
    }
    return notification;
  }

  /**
   * Retry a failed notification manually (internal API)
   */
  async retryFailed(id) {
    const notification = await Notification.findById(id);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    notification.status = PENDING;
    notification.failedReason = undefined;
    await notification.save();

    try {
      const emailQueue = require('../email/email.queue');
      await emailQueue.addEmailJob(notification._id);
      
      notification.status = QUEUED;
      await notification.save();
    } catch (err) {
      console.error('[NotificationService] Failed to retry job:', err.message);
    }

    return notification;
  }

  /**
   * Get notification stats (internal/dashboard)
   */
  async getStats() {
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    
    // Format to a nice object: { sent: 10, failed: 2, etc }
    const formattedStats = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return formattedStats;
  }
}

module.exports = new NotificationService();
