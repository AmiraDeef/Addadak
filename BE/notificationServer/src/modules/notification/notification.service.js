'use strict';

const Notification = require('./notification.model');
const User = require('./user.model');
const Metrics = require('./metrics.model');
const { PENDING, QUEUED } = require('../../shared/constants/notificationStatus');
const {
  AUTOPAY_DISABLED,
  AUTOPAY_SUCCESS,
  PAYMENT_FAILED,
  NO_PAYMENT_METHOD,
} = require('../../shared/constants/notificationType');
const config = require('../../config/env');
const AppError = require('../../shared/helpers/AppError');


class NotificationService {
  /**
   * Process AutoPay for a meter by calling the Wallet Service,
   * mapping the response to the appropriate notification type,
   * saving to MongoDB, and queueing for email delivery.
   *
   * @param {Object} data - Contains meter and user details
   * @param {string} data.meterNumber - Meter number
   * @param {string} data.userId - User ID (MongoDB ObjectId)
   * @param {string} data.nationalID - 14-digit National ID (used as userNId in Wallet call)
   * @param {string} data.email - User email
   * @param {string} [data.meterType] - Meter type
   * @param {string} [data.utility] - Utility
   * @param {string} [data.userName] - User name
   * @param {Object} [data.data] - Additional data / metadata
   * @returns {Promise<Object>} Created notification document
   */
  async processAutoPay(data) {
    if (!data || typeof data !== 'object') {
      throw new AppError('Invalid request payload for AutoPay processing', 400);
    }

    const { meterNumber, userId, nationalID, email, meterType, utility } = data;

    if (!meterNumber || !userId) {
      throw new AppError('meterNumber and userId are required for AutoPay processing', 400);
    }

    if (!nationalID || !email) {
      throw new AppError('nationalID and email are required to create notification', 400);
    }

    // Idempotency / Duplicate protection:
    // Prevent duplicate AutoPay processing if a recent AutoPay notification was created within cooldown window (5 minutes)
    const cooldownMs = 5 * 60 * 1000;
    try {
      const existingRecent = await Notification.findOne({
        meterNumber: String(meterNumber),
        type: { $in: [AUTOPAY_DISABLED, AUTOPAY_SUCCESS, PAYMENT_FAILED, NO_PAYMENT_METHOD] },
        createdAt: { $gte: new Date(Date.now() - cooldownMs) },
      }).sort({ createdAt: -1 });

      if (existingRecent) {
        console.log(`[NotificationService] Idempotency: AutoPay already processed recently for meter ${meterNumber} (${existingRecent.type}). Returning existing notification.`);
        return existingRecent;
      }
    } catch (dbErr) {
      // If query fails (e.g. offline in unit tests), continue safely
    }

    const walletBaseUrl = config.wallet?.url || process.env.WALLET_URL || 'http://localhost:3002';
    // Contract: POST /autopay/process/:userNId/:meterNum (no request body)
    const walletEndpoint = `${walletBaseUrl.replace(/\/+$/, '')}/autopay/process/${encodeURIComponent(nationalID)}/${encodeURIComponent(meterNumber)}`;

    let walletResponseData;

    try {
      const response = await fetch(walletEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.status === 404) {
        console.error(`[NotificationService] User or meter not found in Wallet service: nationalID=${nationalID}, meterNumber=${meterNumber}`);
        throw new AppError(`User or meter not found in Wallet service for nationalID: ${nationalID}, meterNumber: ${meterNumber}`, 404);
      }

      if (!response.ok) {
        let errBody;
        try {
          errBody = await response.json();
        } catch (_) {
          errBody = await response.text();
        }
        const errorMsg = typeof errBody === 'object' && errBody.message ? errBody.message : `Wallet service returned HTTP status ${response.status}`;
        throw new AppError(`Wallet service error: ${errorMsg}`, response.status >= 500 ? 502 : response.status);
      }

      walletResponseData = await response.json();
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(`Failed to communicate with Wallet service: ${err.message}`, 503);
    }

    // Extract return code from Wallet Service
    // The Wallet Service returns one of: AUTOPAY_SUCCESS, AUTOPAY_DISABLED, NO_PAYMENT_METHOD (or PAYMENT_FAILED)
    const code = walletResponseData?.code || walletResponseData?.status || (typeof walletResponseData === 'string' ? walletResponseData : null);

    const CODE_MAP = {
      AUTOPAY_SUCCESS: {
        type: AUTOPAY_SUCCESS,
        title: 'تم شحن عدادك تلقائياً — Addadak',
        message: 'تم شحن عدادك بنجاح تلقائياً وتجنب انقطاع الخدمة.',
      },
      AUTOPAY_DISABLED: {
        type: AUTOPAY_DISABLED,
        title: 'عدادك فصل — Addadak',
        message: 'عدادك فصل، يرجى الشحن يدوياً.',
      },
      NO_PAYMENT_METHOD: {
        type: NO_PAYMENT_METHOD,
        title: 'لا توجد وسيلة دفع مسجلة — Addadak',
        message: 'تعذر إتمام الدفع التلقائي لعدم وجود وسيلة دفع مسجلة، يرجى الشحن يدوياً.',
      },
      PAYMENT_FAILED: {
        type: PAYMENT_FAILED,
        title: 'فشل الدفع التلقائي — Addadak',
        message: 'فشلت عملية الدفع التلقائي، يرجى الشحن يدوياً.',
      },
    };

    const mapped = CODE_MAP[code];
    if (!mapped) {
      throw new AppError(`Invalid or unknown AutoPay response code from Wallet: ${code || 'empty'}`, 502);
    }

    // Save notification to MongoDB and queue in BullMQ using existing createAndQueue
    const notification = await this.createAndQueue({
      userId,
      nationalID,
      email,
      type: mapped.type,
      title: mapped.title,
      message: mapped.message,
      meterNumber,
      meterType,
      utility,
      data: {
        ...(data.data || {}),
        userName: data.userName || data.data?.userName,
        meterNumber,
        message: mapped.message,
        autoPayCode: code,
        walletResponse: walletResponseData,
      },
    });

    return notification;
  }

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
   * Send notification to all users sharing the same address/location
   *
   * @param {Object} data - Contains address and notification payload
   * @param {string} [data.address] - Physical address / location
   * @param {string} [data.location] - Alias for address
   * @param {string} data.type - Notification type
   * @param {string} data.title - Notification title
   * @param {string} data.message - Notification body / message
   * @param {Object} [data.data] - Additional metadata / template values
   * @param {string} [data.utility] - Optional utility filter ('Electricity', 'Water', 'Gas')
   * @param {string} [data.meterType] - Optional meter type
   * @param {string|Date} [data.scheduledFor] - Optional future schedule date
   * @returns {Promise<Object>} Summary of created notifications and recipient count
   */
  async notifyByAddress(data) {
    if (!data || typeof data !== 'object') {
      throw new AppError('Invalid request payload for address notification', 400);
    }

    const targetAddress = (data.address || data.location || '').trim();
    if (!targetAddress) {
      throw new AppError('Address/location is required', 400);
    }

    // 1. Query Metrics collection to find all meters at this address
    const escapedAddress = targetAddress.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const addressRegex = new RegExp(`^${escapedAddress}$`, 'i');

    const metricsFilter = {
      address: { $regex: addressRegex },
    };

    if (data.utility) {
      metricsFilter.utility = data.utility;
    }
    if (data.meterType) {
      metricsFilter.meterType = data.meterType;
    }

    const matchingMetrics = await Metrics.find(metricsFilter)
      .select('nationalID meterNumber meterType utility address')
      .lean();

    if (!matchingMetrics || matchingMetrics.length === 0) {
      throw new AppError(`No users found for address: ${targetAddress}`, 404);
    }

    // 2. Extract unique national IDs from matching metrics
    const nationalIDs = [...new Set(matchingMetrics.map((m) => m.nationalID).filter(Boolean))];
    if (nationalIDs.length === 0) {
      throw new AppError(`No users found for address: ${targetAddress}`, 404);
    }

    // 3. Query User collection in bulk for all matching national IDs
    const users = await User.find({ nationalID: { $in: nationalIDs } })
      .select('_id nationalID email firstName lastName phone')
      .lean();

    if (!users || users.length === 0) {
      throw new AppError(`No users found for address: ${targetAddress}`, 404);
    }

    // Map each nationalID to its first matching meter info for convenience
    const meterByNId = {};
    for (const metric of matchingMetrics) {
      if (!meterByNId[metric.nationalID]) {
        meterByNId[metric.nationalID] = metric;
      }
    }

    // 4. Build notification document for each user
    const notificationDocs = users.map((user) => {
      const meter = meterByNId[user.nationalID] || {};
      const userName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'عميلنا العزيز';

      return {
        userId: user._id,
        nationalID: user.nationalID,
        email: user.email,
        type: data.type,
        title: data.title,
        message: data.message,
        data: {
          ...(data.data || {}),
          userName,
          address: targetAddress,
          ...(meter.meterNumber ? { meterNumber: meter.meterNumber } : {}),
        },
        meterNumber: data.meterNumber || meter.meterNumber,
        meterType: data.meterType || meter.meterType,
        utility: data.utility || meter.utility,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined,
        status: PENDING,
        isRead: false,
      };
    });

    // 5. Bulk insert notification records into MongoDB
    const insertedNotifications = await Notification.insertMany(notificationDocs);

    // 6. Bulk enqueue jobs into BullMQ
    try {
      const emailQueue = require('../email/email.queue');
      const ids = insertedNotifications.map((n) => n._id);

      let delayMs = 0;
      if (data.scheduledFor) {
        delayMs = Math.max(0, new Date(data.scheduledFor).getTime() - Date.now());
      }

      await emailQueue.addBulkEmailJobs(ids, delayMs);

      // 7. Update status to QUEUED in bulk
      await Notification.updateMany(
        { _id: { $in: ids } },
        { status: QUEUED }
      );

      insertedNotifications.forEach((n) => {
        n.status = QUEUED;
      });
    } catch (err) {
      console.error('[NotificationService] Failed to bulk queue jobs for address notification:', err.message);
      // Status remains PENDING so they can be retried later
    }

    return {
      address: targetAddress,
      totalRecipients: insertedNotifications.length,
      notifications: insertedNotifications,
    };
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
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
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
