import express from 'express';
import router from '@/routes/routes.js';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import { config } from '@/helpers/infra/global_config.js';
import cors from 'cors'

import fs from 'fs';
import YAML from 'js-yaml';
import logger from '@/helpers/utils/logger.js';

const swaggerDocument = YAML.load(fs.readFileSync('./docs/docs.yaml', 'utf8'));
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      msg: 'HTTP',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
    });
  });
  next();
});
app.use(router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = config.port || 8080;

app.listen(port, () => {
  logger.info(`Server started at http://localhost:${port}`);
});

