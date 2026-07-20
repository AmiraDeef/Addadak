'use strict';

const { emailQueue } = require('../../config/bullmq');

class QueueService {
  /**
   * Get job counts by status
   */
  async getJobCounts() {
    return emailQueue.getJobCounts(
      'waiting', 'active', 'completed', 'failed', 'delayed'
    );
  }

  /**
   * Get failed jobs for review
   */
  async getFailedJobs(start = 0, end = 10) {
    return emailQueue.getFailed(start, end);
  }
}

module.exports = new QueueService();
