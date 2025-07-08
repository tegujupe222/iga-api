const { createClient } = require('redis');

let client = null;
let connectionAttempted = false;

async function getClient() {
  if (connectionAttempted) {
    return client;
  }

  connectionAttempted = true;

  // REDIS_URLが設定されていない場合はnullを返す
  if (!process.env.REDIS_URL) {
    return null;
  }

  try {
    client = createClient({ 
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000,
        lazyConnect: true
      }
    });

    // 接続テスト
    await client.connect();
    await client.ping();
    
    console.log('Redis connected successfully');
    return client;
  } catch (error) {
    console.warn('Redis connection failed:', error.message);
    client = null;
    return null;
  }
}

module.exports = { getClient }; 