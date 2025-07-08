const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { getClient } = require('../utils/cache');

router.get('/', async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    // Redis接続チェック
    try {
      const redisClient = await getClient();
      if (redisClient) {
        await redisClient.ping();
        healthStatus.redis = 'connected';
      } else {
        healthStatus.redis = 'not_configured';
      }
    } catch (redisError) {
      healthStatus.redis = 'error';
      healthStatus.redisError = redisError.message;
      logger.warn('Redis health check failed', { error: redisError.message });
    }

    // 全体的なヘルスステータスを決定
    if (healthStatus.redis === 'error') {
      healthStatus.status = 'degraded';
    }

    logger.info('Health check completed', { status: healthStatus.status });
    res.status(200).json(healthStatus);

  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router; 