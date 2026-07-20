'use strict';

const { redisClient } = require('../../config/redis');

class RedisService {
  /**
   * Health check for Redis connection
   * @returns {Promise<boolean>} True if connected
   */
  async isConnected() {
    return redisClient.status === 'ready';
  }

  /**
   * Graceful shutdown of Redis connection
   */
  async gracefulShutdown() {
    await redisClient.quit();
    console.log('[Redis] Connection closed gracefully');
  }

  /**
   * Access raw client if needed for custom commands
   */
  getClient() {
    return redisClient;
  }
}

module.exports = new RedisService();
