'use strict';

const { emailQueue, defaultJobOptions } = require('../../config/bullmq');
const config = require('../../config/env');

class EmailQueueService {
  /**
   * Adds a standard immediate job to send an email
   * @param {string} notificationId - The MongoDB ObjectId of the notification
   */
  async addEmailJob(notificationId) {
    return emailQueue.add(
      'send-email',
      { notificationId: String(notificationId) },
      { ...defaultJobOptions }
    );
  }

  /**
   * Adds a delayed job (e.g. for scheduled payment reminders)
   * @param {string} notificationId - The MongoDB ObjectId
   * @param {number} delayMs - Delay in milliseconds from now
   */
  async addDelayedEmailJob(notificationId, delayMs) {
    return emailQueue.add(
      'send-email',
      { notificationId: String(notificationId) },
      { ...defaultJobOptions, delay: delayMs }
    );
  }

  /**
   * Schedules a recurring BullMQ Repeatable Job to clean up old data
   * (Runs according to BULL_CLEANUP_CRON env var, e.g., every 6 hours)
   */
  async scheduleCleanupJob() {
    await emailQueue.add(
      'cleanup-job',
      {},
      {
        repeat: { pattern: config.bull.cleanupCron },
        jobId: 'repeatable-cleanup-job', // Ensures we don't schedule multiple
      }
    );
    console.log(`[BullMQ] Scheduled repeatable cleanup job (${config.bull.cleanupCron})`);
  }
}

module.exports = new EmailQueueService();
