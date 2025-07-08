const request = require('supertest');
const express = require('express');
const healthRoute = require('../src/routes/health');

// Redis接続をモック
jest.mock('../src/utils/cache', () => ({
  getClient: jest.fn().mockResolvedValue(null)
}));

const app = express();
app.use('/health', healthRoute);

describe('Health Check Endpoint', () => {
  test('should return 200 and health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('memory');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('environment');
    expect(response.body).toHaveProperty('redis');
  });

  test('should have valid timestamp format', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp.toString()).not.toBe('Invalid Date');
  });

  test('should have valid uptime', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(typeof response.body.uptime).toBe('number');
    expect(response.body.uptime).toBeGreaterThan(0);
  });

  test('should handle Redis not configured', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.redis).toBe('not_configured');
  });
}); 