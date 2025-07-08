const express = require('express');
const router = express.Router();

// サンプルデータ
const mapData = [
  {
    name: 'スペース・マウンテン',
    area: 'トゥモローランド',
    type: 'attraction',
    park: 'land',
    lat: 35.632896,
    lng: 139.880394,
    description: '人気の屋内ローラーコースター'
  },
  {
    name: 'ビッグサンダー・マウンテン',
    area: 'ウエスタンランド',
    type: 'attraction',
    park: 'land',
    lat: 35.634000,
    lng: 139.878500,
    description: '鉱山を駆け抜けるジェットコースター'
  },
  {
    name: 'タワー・オブ・テラー',
    area: 'アメリカンウォーターフロント',
    type: 'attraction',
    park: 'sea',
    lat: 35.626500,
    lng: 139.884000,
    description: 'フリーフォール型アトラクション'
  },
  {
    name: 'マーメイドラグーンシアター',
    area: 'マーメイドラグーン',
    type: 'attraction',
    park: 'sea',
    lat: 35.627800,
    lng: 139.886200,
    description: 'リトル・マーメイドのショーが楽しめる'
  },
  {
    name: 'ワールドバザール・レストラン',
    area: 'ワールドバザール',
    type: 'restaurant',
    park: 'land',
    lat: 35.632100,
    lng: 139.880800,
    description: '多彩な料理が楽しめるレストラン'
  }
];

// /map?park=land&type=attraction などで絞り込み可能
router.get('/', (req, res) => {
  const { park, type, area } = req.query;
  let result = mapData;
  if (park) result = result.filter(item => item.park === park);
  if (type) result = result.filter(item => item.type === type);
  if (area) result = result.filter(item => item.area === area);
  res.json(result);
});

module.exports = router; 