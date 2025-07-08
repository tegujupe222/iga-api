const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { getClient } = require('../utils/cache');

// ダミーデータ（実際のスクレイピング結果を模擬）
const getDummyData = (park, type) => {
  const attractions = {
    land: {
      standby: [
        { name: 'スペース・マウンテン', info: '45分', status: '運営中' },
        { name: 'スプラッシュ・マウンテン', info: '60分', status: '運営中' },
        { name: 'ビッグサンダー・マウンテン', info: '30分', status: '運営中' },
        { name: 'ホーンテッドマンション', info: '20分', status: '運営中' },
        { name: 'ピーター・パン空の旅', info: '90分', status: '運営中' }
      ],
      fastpass: [
        { name: 'スペース・マウンテン', info: '14:00-15:00', status: '配布中' },
        { name: 'スプラッシュ・マウンテン', info: '15:30-16:30', status: '配布中' },
        { name: 'ビッグサンダー・マウンテン', info: '16:00-17:00', status: '配布中' }
      ]
    },
    sea: {
      standby: [
        { name: 'タワー・オブ・テラー', info: '50分', status: '運営中' },
        { name: 'インディ・ジョーンズ・アドベンチャー', info: '40分', status: '運営中' },
        { name: 'レイジング・スピリッツ', info: '35分', status: '運営中' },
        { name: '20,000リーグ・アンダー・ザ・シー', info: '25分', status: '運営中' },
        { name: 'ジャスミンのフライング・カーペット', info: '15分', status: '運営中' }
      ],
      fastpass: [
        { name: 'タワー・オブ・テラー', info: '14:30-15:30', status: '配布中' },
        { name: 'インディ・ジョーンズ・アドベンチャー', info: '15:00-16:00', status: '配布中' },
        { name: 'レイジング・スピリッツ', info: '16:30-17:30', status: '配布中' }
      ]
    }
  };

  return attractions[park]?.[type] || [];
};

router.get('/', async (req, res) => {
  try {
    const { park, type, token } = req.query;
    
    // トークン認証
    if (!token || token !== process.env.API_TOKEN) {
      logger.warn('Invalid API token attempt', { ip: req.ip, userAgent: req.get('User-Agent') });
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'API認証トークンが無効です'
      });
    }

    // パラメータ検証
    if (!park || !type) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'park と type パラメータが必要です',
        required: ['park', 'type'],
        validValues: {
          park: ['land', 'sea'],
          type: ['standby', 'fastpass']
        }
      });
    }

    // 有効な値かチェック
    const validParks = ['land', 'sea'];
    const validTypes = ['standby', 'fastpass'];
    
    if (!validParks.includes(park)) {
      return res.status(400).json({
        error: 'Invalid park parameter',
        message: '無効なparkパラメータです',
        validValues: validParks
      });
    }

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Invalid type parameter',
        message: '無効なtypeパラメータです',
        validValues: validTypes
      });
    }

    // キャッシュからデータを取得（Redisが利用可能な場合）
    let data = null;
    const cacheKey = `disney:${park}:${type}`;
    
    try {
      const redisClient = await getClient();
      if (redisClient) {
        data = await redisClient.get(cacheKey);
        if (data) {
          data = JSON.parse(data);
          logger.info('Data retrieved from cache', { park, type });
        }
      }
    } catch (cacheError) {
      logger.warn('Cache error, falling back to direct data', { error: cacheError.message });
    }

    // キャッシュにない場合はダミーデータを生成
    if (!data) {
      data = getDummyData(park, type);
      
      // キャッシュに保存（Redisが利用可能な場合）
      try {
        const redisClient = await getClient();
        if (redisClient) {
          await redisClient.setEx(cacheKey, 300, JSON.stringify(data)); // 5分間キャッシュ
          logger.info('Data cached', { park, type });
        }
      } catch (cacheError) {
        logger.warn('Failed to cache data', { error: cacheError.message });
      }
    }

    // レスポンス
    const response = {
      park,
      type,
      data,
      timestamp: new Date().toISOString(),
      source: 'Tokyo Disney Resort Unofficial API',
      version: '2.0.0'
    };

    logger.info('API request successful', { park, type, dataCount: data.length });
    res.json(response);

  } catch (error) {
    logger.error('Error in exec route', { error: error.message, stack: error.stack });
    res.status(500).json({
      error: 'Internal server error',
      message: 'サーバー内部エラーが発生しました'
    });
  }
});

module.exports = router; 