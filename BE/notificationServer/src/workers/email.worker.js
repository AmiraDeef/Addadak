'use strict';

const { Worker } = require('bullmq');
const { redisOptions } = require('../config/redis');
const Notification = require('../modules/notification/notification.model');
const emailService = require('../modules/email/email.service');
const { PROCESSING, SENT, FAILED, PERMANENTLY_FAILED } = require('../shared/constants/notificationStatus');

let worker;

/**
 * Initializes the BullMQ worker for the email-queue
 */
const initEmailWorker = () => {
  worker = new Worker(
    'email-queue',
    async (job) => {
      // 1. Is this the Repeatable Cleanup Job?
      if (job.name === 'cleanup-job') {
        console.log(`[Worker] 🧹 Running cleanup job...`);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        // Optionally delete very old sent notifications to save space
        const result = await Notification.deleteMany({
          status: { $in: [SENT, PERMANENTLY_FAILED] },
          createdAt: { $lt: oneWeekAgo },
        });
        console.log(`[Worker]  Cleanup finished. Deleted ${result.deletedCount} old notifications.`);
        return { deleted: result.deletedCount };
      }

      // 2. Normal / Delayed Email Job
      const { notificationId } = job.data;
      if (!notificationId) {
        throw new Error('No notificationId provided in job data');
      }

      // Load notification from DB
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        throw new Error(`Notification ${notificationId} not found in DB`);
      }

      // Mark as processing
      notification.status = PROCESSING;
      await notification.save();

      try {
        // Send email
        const info = await emailService.sendNotificationEmail(notification);
        
        // Update on success
        notification.status = SENT;
        notification.sentAt = new Date();
        await notification.save();

        return { messageId: info.messageId };
      } catch (err) {
        // We throw so BullMQ handles the retry
        throw err;
      }
    },
    {
      connection: redisOptions,
      concurrency: 5, // Process up to 5 emails concurrently
    }
  );

  //  Worker Event Listeners 

  worker.on('completed', (job, returnvalue) => {
    if (job.name === 'cleanup-job') return;
    console.log(`[Worker] Job ${job.id} completed (Notification ${job.data?.notificationId})`);
  });

  worker.on('failed', async (job, err) => {
    if (job.name === 'cleanup-job') {
      console.error(`[Worker]  Cleanup job failed:`, err.message);
      return;
    }

    const { notificationId } = job.data;
    if (!notificationId) return;

    try {
      const notification = await Notification.findById(notificationId);
      if (notification) {
        const isPermanent = job.attemptsMade >= job.opts.attempts;
        
        notification.status = isPermanent ? PERMANENTLY_FAILED : FAILED;
        notification.attemptCount = job.attemptsMade;
        notification.lastAttemptAt = new Date();
        notification.failedReason = err.message;
        
        await notification.save();

        if (isPermanent) {
          console.error(`[Worker] Job ${job.id} permanently failed after ${job.attemptsMade} attempts (Notification ${notificationId})`);
        } else {
          console.warn(`[Worker] Job ${job.id} failed (attempt ${job.attemptsMade}), retrying...`);
        }
      }
    } catch (dbErr) {
      console.error(`[Worker] Failed to update notification status after job failure:`, dbErr.message);
    }
  });

  worker.on('error', (err) => {
    console.error('[Worker] Worker error:', err);
  });

  console.log('[Worker] email.worker initialized and listening for jobs');
};

module.exports = { initEmailWorker };
