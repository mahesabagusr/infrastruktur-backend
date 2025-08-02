import express from 'express';
import router from '@/routes/routes.js';
import swaggerUi from 'swagger-ui-express';
import { config } from '@/helpers/infra/global_config.js';

import fs from 'fs';
import YAML from 'js-yaml';

const swaggerDocument = YAML.load(fs.readFileSync('./docs/docs.yaml', 'utf8'));
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
app.use(router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = config.port || 8080;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

