const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
const execRoute = require('./routes/exec');
const healthRoute = require('./routes/health');
const metricsRoute = require('./routes/metrics');
const mapRoute = require('./routes/map');

const app = express();
const swaggerDocument = yaml.load(fs.readFileSync(__dirname + '/../swagger.yaml', 'utf8'));

app.use(express.json());

// CORS設定
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({
    name: 'Tokyo Disney Resort Unofficial API',
    version: '2.0.0',
    description: '東京ディズニーリゾートの待ち時間情報を提供する非公式API',
    endpoints: {
      docs: '/docs',
      health: '/health',
      metrics: '/metrics',
      exec: '/exec?park=land&type=standby&token=YOUR_TOKEN'
    },
    timestamp: new Date().toISOString()
  });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/exec', execRoute);
app.use('/health', healthRoute);
app.use('/metrics', metricsRoute);
app.use('/map', mapRoute);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`API server running on port ${port}`);
}); 